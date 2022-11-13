using CatalogService as service from '../../srv/interaction_srv';

annotate service.Interactions_Items with @(
    UI.FieldGroup #GeneratedGroup1 : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'INTHeader_ID',
                Value : INTHeader_ID,
            },
            {
                $Type : 'UI.DataField',
                Label : 'TEXT_ID',
                Value : TEXT_ID,
            },
            {
                $Type : 'UI.DataField',
                Label : 'LANGU',
                Value : LANGU,
            },
            {
                $Type : 'UI.DataField',
                Label : 'LOGTEXT',
                Value : LOGTEXT,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup1',
        },
    ]
);
