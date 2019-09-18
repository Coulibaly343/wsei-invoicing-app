import { Observable, of } from 'rxjs';
import { Item } from './item';

export class LocalItemCatalog {
    private availableItems: Item[] = [
        {name: 'clean code'},
        {name: 'pragmatic programmer'},
        {name: 'Test Driven Development'},
    ];

    items(query: string): Observable<Item[]> {
        return of(this.availableItems
            .filter(i => i.name.includes(query))
        );
    }
}
