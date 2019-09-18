import { Observable } from 'rxjs';
import { Item } from './item';

export abstract class ItemCatalog {
    abstract items(query: string): Observable<Item[]>;
}
