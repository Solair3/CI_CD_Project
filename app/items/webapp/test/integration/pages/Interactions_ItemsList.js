sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'dynit.cicd.items.items',
            componentId: 'Interactions_ItemsList',
            entitySet: 'Interactions_Items'
        },
        CustomPageDefinitions
    );
});