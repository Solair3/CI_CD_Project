using CatalogService as service from '../../srv/interaction_srv';

annotate CatalogService.Interactions_Items with @(
    UI : {
        HeaderInfo : {
            $Type : 'UI.HeaderInfoType',
            TypeName : '{i18n>TypeNameSingularItems}',
            TypeNamePlural : '{i18n>TypeNamePluralItems}',
            Title: {$Type: 'UI.DataField', Value: TEXT_ID},
            Description: {$Type: 'UI.DataField', Value: LOGTEXT}
        },
        LineItem : [
            {$Type: 'UI.DataField', Value: INTHeader.ID},
            {$Type: 'UI.DataField', Value: TEXT_ID},
            {$Type: 'UI.DataField', Value: LANGU},
            {$Type: 'UI.DataField', Value: LOGTEXT},
        ]
    }
);