// List all campaigns except disabled
exports.list = function (req, res, next) {
    if (utils.isAllowed(req.user, actions.LIST_CAMPAIGNS, null)) {

        let acc_options = { where: {} };
        acc_options.where.id = req.user.scope_account_id;
        acc_options.where.status = { $or: ['active', 'inactive'] };
        let campOptions = utils.generateOptions(req.body, 'campaigns');
        campOptions.where.status = {
            $or: ['active', 'inactive', 'complete']
        };
        if (validators.id(req.body.id)) {
            campOptions.where.advertiser_id = req.body.id;
        }
        campOptions.attributes = ['id', 'name', 'created_at', 'start_time', 'end_time', 'status'];
        campOptions.include = [
            {
                model: models.flights,
                attributes: ['id'],
                required: false,
                where: {
                    status: {
                        $or: ['active', 'inactive', 'complete', 'capped', 'complete', 'paused']
                    }
                }
            },
            {
                model: models.advertisers,
                attributes: ['id', 'name'],
                required: true
            }
        ];

        models.accounts.findOne({
            where: acc_options.where
        })
            .then(q_res => {
                if (q_res.is_zone_master) {
                    campOptions.where.zone_id = q_res.zone_id;
                    console.log("ZONE MASTER!!");
                } else {
                    campOptions.where.zone_id = q_res.zone_id;
                    campOptions.where.account_id = req.user.scope_account_id;

                }


                models.campaigns.count({
                    where: campOptions.where
                })
                    .then(count => {
                        return models.campaigns.findAll(campOptions)
                            .then(results => {
                                let payload = {};
                                payload.rows = results;
                                payload.pagination = {
                                    currentPage: req.body.currentPage || 1,
                                    limit: req.body.pageChunk || 15,
                                    totalPages: Math.ceil(count / (req.body.pageChunk || 15))
                                };
                                res.json(payload);
                            })
                            .catch(err => {
                                res.status(503).send({ message: "Could not display campaigns at this time. Please try again later." });
                            })
                    })
                    .catch(err => {
                        res.status(503).send({ message: "Could not display campaigns at this time. Please try again later." });
                    })
            })
            .catch(err => {
                res.status(503).send({ message: "Could not display placements at this time. Please try again later." });
            }
            )
    } else {
        res.sendStatus(401);
    }
};


