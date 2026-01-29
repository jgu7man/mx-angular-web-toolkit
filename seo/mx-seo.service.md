# MxSEO

Un auxilar para configuración de SEO de manera reactiva. La estrategía de renderizado desde el servidor no es responsabilidad de esta librería. Puedes usar `@angular/universal`, `puppeteer`, `cloud functions` el que tú quieras para que esto funcione de la mejor manera.

## Primeros pasos

Si ya tienes instalada la librería `@marxa-digital/devkit` no ocupas hacer nada más.

## Uso básico

### Title

Puedes agrega en tu `app.module.ts` el método de `updateTitle()` para automáticamente renderizar el título en la pestaña de tu navegador o actualizar el título de tu documento basado en tus archivos `*routing.module.ts`

Para esto en cada archivo ROUTING que desees puedes agregar la data "title" para asignar título.

```ts
const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      { path: '', component: InicioComponent, data: { title: 'Inicio' } }
    ]
  }
];
```

OPCIONALMENTE Puedes agregar un prefijo que siempre aparecerá al principio del título.

```ts
import { MxSEO } from '@marxa-digital/devkit';

export class AppComponent implements OnInit {
  constructor(private _seo: MxSEO) {
    this._seo.updateTitle('My App');
    // RESULT My App - Inicio
  }

  ngOnInit() {}
}
```

### Meta Tags

En cualquier componente que desees puedes crear o configurar Meta Tags previamente diseñadas para renderizar en redes sociales, twitter, facebook y RSS

```ts
import { MxSEO } from '@marxa-digital/devkit';

export class AppComponent implements OnInit {
  constructor(private _seo: MxSEO) {
    const pageTags: SEOCONFIG = {
      title: 'My app',
      description: 'This is my app',
      keywords: 'app, mine',
      image: 'https://image',
      slug: 'my-app'
    };
    this._seo.setTags(pageTags);
    // RESULT My App - Inicio
  }

  ngOnInit() {}
}
```

### SEOCONFIG

| Parámetro | Descripción |
| --- | --- |
| `title: string` | El título del documento |
| `description:string` | OPCIONAL Descripción del sitio o ruta actual, se recomienda no mayor a 256 caracteres para cumplir con la regla de twitter |
| `keywords: string` | Las palabras claves en linea de texto separadas por comas. No se recomiendan más de 10 |
| `image: string` | URL de la imagen que puede renderizarse en RSS |
| `slug: string` | Título descriptivo del sitio sin espacios ni caracteres especiales |
