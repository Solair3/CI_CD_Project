using {NorthWind} from './external/NorthWind.csn';

service NorthWindCatalogService {

    @readonly
    entity Products as projection on NorthWind.Products {
        key ID,
            Name,
            Description,
            ReleaseDate,
            DiscontinuedDate,
            Rating,
            Price
    };

}
