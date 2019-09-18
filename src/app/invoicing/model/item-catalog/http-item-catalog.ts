import { HttpClient } from '@angular/common/http';
import { ItemCatalog } from './item-catalog';
import { Observable, merge } from 'rxjs';
import { Item } from './item';
import { map, flatMap, mergeMap, concatMap } from 'rxjs/operators';

interface Book {
    volumeInfo: BookInfo;
}

interface BookInfo {
    title: string;
}

interface BooksResponse {
    items: Book[];
}
export class HttpItemCatalog extends ItemCatalog {
    readonly BASE_QUERY_URL = 'https://www.googleapis.com/books/v1/volumes';

    constructor(
        private http: HttpClient
    ) {
        super();
    }

    items(query: string): Observable<Item[]> {
        const query_url = `${this.BASE_QUERY_URL}?q=${query}`;

        return this.http.get<BooksResponse>(query_url).pipe(
            map(r => r.items),
            map(items => items.map(i => this.mapToItem(i)))
        );
    }

    mapToItem(i: Book): any {
        return {name: i.volumeInfo.title};
    }
}
