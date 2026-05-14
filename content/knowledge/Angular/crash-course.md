---
title: "Crash Course"
date: "2026-05-13"
level: "Beginner with React / Vue experience"
---


# Component 

Ein Angular-Component besteht normalerweise aus mehreren Dateien, die zusammenarbeiten.

Mit folgendem Befehl:

```bash
ng generate component app-risk-table
```

wird automatisch ein neuer Ordner erstellt.

Beispiel:

```text
app-risk-table/
├── app-risk-table.ts // Logic
├── app-risk-table.html // UI
├── app-risk-table.scss // Style
└── app-risk-table.spec.ts // Unit Test
```

## `app-risk-table.ts`

Beispiel:

```ts
@Component({
  selector: 'app-risk-table',
  standalone: true,
  templateUrl: './app-risk-table.html',
  styleUrls: ['./app-risk-table.scss']
})
export class RiskTableComponent {
}
```

- `selector` definiert: Wie diese Komponente in HTML verwendet wird.
  - Mit `<app-risk-table></app-risk-table>` in `.html` wird Risk Table Component gerendert.

- `standalone: true` bedeutet, dass das Component unabhängig von einem `NgModule` verwendet werden kann.
  - Früher musste ein Component in einem `NgModule` registriert werden. Mit `standalone: true` ist das nicht mehr notwendig.
  - `standalone` bedeutet jedoch nicht, dass ein Component automatisch im HTML-Template verwendet werden kann.
  - Verwendete Components müssen zuerst im `imports`-Array importiert werden.
    - Beispiel: `imports: [RiskTableComponent]` 
  - Erst danach kann `<app-risk-table></app-risk-table>` im Template verwendet werden.

---
### Data Binding

Hier werden Daten definiert, die später im HTML-Template verwendet werden.

Beispiel:

```ts
export class RiskTableComponent {
  displayedColumns = ['id', 'institution'];
  dataSource: Risk[] = [];
}
```

```html
<table mat-table [dataSource]="dataSource">

  <ng-container matColumnDef="id">
    <th mat-header-cell *matHeaderCellDef>ID</th>
    <td mat-cell *matCellDef="let el">
      {{ el.id }}
    </td>
  </ng-container>

  <ng-container matColumnDef="institution">
    <th mat-header-cell *matHeaderCellDef>
      Institution
    </th>
    <td mat-cell *matCellDef="let el">
      {{ el.institution }}
    </td>
  </ng-container>

  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>

</table>
```
### API-Aufruf über Service

```ts
export class RiskTableComponent implements OnInit {
  displayedColumns = ['id', 'institution'];
  dataSource: Risk[] = [];

  ngOnInit(): void {
    this.riskService.getRisks().subscribe((data) => {
      this.dataSource = data;
      this.filteredData = data;
    });
  }
}
```


`ngOnInit` ist ein Lifecycle-Hook in Angular.
- wird automatisch beim Start des Components aufgerufen
- läuft nachdem Angular das Component erstellt hat
- wird häufig für Initialisierungslogik verwendet

`implements OnInit` 
- ist nicht zwingend notwendig für die Ausführung 
- aber es bringt TypeScript-Typensicherheit und verbessert die Lesbarkeit des Codes
- Es signalisiert klar, dass die Komponente den Lifecycle-Hook `ngOnInit` verwendet.

`this.riskService.getRisks()` ruft eine Methode im Service auf
- diese Methode liefert Daten vom Backend
- Rückgabewert ist ein **Observable**

Angular verarbeitet asynchrone Daten mit `.subscribe()`:
- sobald Daten ankommen, wird der Callback ausgeführt
- data enthält dann die erhaltenen Risikoliste
- Ohne subscribe passiert nichts, weil Observables lazy sind.



---

### Two-Way Binding & Event Binding

Hier werden Methoden geschrieben und Benutzerinteraktionen verarbeitet.

Beispiel:

```html
<mat-select [(value)]="selectedType" (selectionChange)="applyFilter()">
  <mat-option value="">All</mat-option>
  <mat-option value="AML">AML</mat-option>
  <mat-option value="Credit">Credit</mat-option>
  <mat-option value="Market">Market</mat-option>
</mat-select>
```

- `[(value)]` verbindet das ausgewählte Dropdown-Element mit der Variable `selectedType`
  - wenn der Benutzer eine Auswahl trifft, wird selectedType automatisch aktualisiert
  - wenn sich selectedType im TypeScript ändert, wird das UI ebenfalls aktualisiert

- `(selectionChange)` reagiert auf Benutzeraktionen
  - sobald der Benutzer eine neue Option auswählt, wird die Methode `applyFilter()` aufgerufen


```ts
export class RiskTableComponent {
  selectedType: string = '';

  applyFilter(): void {
    this.filteredData = this.dataSource.filter(
      (item) => item.status === this.selectedType
    );
  }
}
```



---

# Dependency Injection (DI)

Beispiel:
```ts
export class RiskTableComponent {
  constructor(
    private riskService: RiskService, // Kommunikation mit Backend oder API
    private dialog: MatDialog, // Öffnen von Dialogen
  ) {}
}
```

Der `constructor` wird verwendet, um Abhängigkeiten in ein Component zu injizieren. Dadurch können Services oder andere Angular-Funktionen innerhalb des Components verwendet werden. Die Objekte werden automatisch von Angular erstellt und bereitgestellt.
- `imports` definiert Components / Directives in Template 
- `constructor` definiert Services / Objekte in TS Logik

## Komponenten dynamisch zur Laufzeit erstellen

tbc.

