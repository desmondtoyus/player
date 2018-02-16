exports.create = function (req, res, next) {
    if (validators.campaign(req.body, 'create')) {
        if (utils.isAllowed(req.user, actions.CREATE_CAMPAIGN, null)) {
            const findAdv = async () => {
                return await models.advertisers.findOne({ where: { id: req.body.advertiserId } });


            };
            findAdv().then(adv => {


                models.campaigns.findOne({
                    where: {
                        name: req.body.name,
                        day_impression_goal: req.body.dayImpressionGoal,
                        total_impression_goal: req.body.totalImpressionGoal,
                        zone_id: req.user.scope_zone_id,
                        account_id: req.user.scope_account_id,
                        account_id: adv.account_id,
                        advertiser_id: req.body.advertiserId,
                        timezone: req.user.timezone
                    };
        .catch(err => {
          res.status(503).send({ msg: 'We could not create the campaign at this time. Please try again later' });
                })
            })
                .catch(err => {
                    res.status(503).send({ msg: 'We could not create the campaign at this time. Please try again later' });
                })
        }
        else {
            res.status(401).send({ msg: 'Your are not authorized to perform this operation' });
    .then(q_res => {
                if (q_res.is_zone_master) {
