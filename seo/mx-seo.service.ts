import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2, ViewEncapsulation } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { MxLocationService } from '../location';
import { LinkDefinition, MetaRobotsValues, MxSeoConfig } from './mx-seo.model';

@Injectable({ providedIn: 'root' })
export class MxSEO {
  private render: Renderer2;

  constructor(
    private meta: Meta,
    private title: Title,
    private renderFac: RendererFactory2,
    private location: MxLocationService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.render = this.renderFac.createRenderer(null, null);
  }

  /**
   * Cambia el título del documento (en la pestaña del navegador) a través de la data que se asigne en los doccumentos `routing-module.ts` como "title".
   *
   * @param {string} [prefix] OPCIONAL Puede asignarse un prefijo al titulo como el nombre global del sitio.
   */
  updateTitle(prefix?: string) {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          let title;
          if (prefix) title = prefix;
          while (route.firstChild) {
            const data = route.firstChild.snapshot.data;
            title = title ? (data['title'] ? `${title} - ${data['title']}` : title) : data['title'];
            route = route.firstChild;
          }
          this.title.setTitle(title);
        })
      )
      .subscribe();
  }

  /**
   * Crea meta tags en el documento `index.html` para efectos de SEO
   *
   * @param {MxSeoConfig} config debe contener la configuración explícita
   */
  setTags(config: MxSeoConfig) {
    const { title = '', description = '', image = '', slug = '' } = config;
    const keywords = (config.keywords = config.keywords || title);

    const formattedTitle = this.capitalizeTitle(title, true);
    const seoDescription = this.getDescription(description);

    this.setTitleTags(formattedTitle);
    this.setMetaTag('description', seoDescription);
    this.setMetaTag('image', image);

    this.setKeywords(keywords);
    this.setSlug(slug);
  }

  capitalizeTitle(text: string, onlyFirst: boolean = false) {
    const lowerAll = text.toLowerCase();
    const first = lowerAll.substring(0, 1).toUpperCase();
    const rest = lowerAll.substring(1, text.length);
    return onlyFirst
      ? `${first}${rest}`
      : lowerAll.replace(/(?:^|\s|["'([{])+\S/g, (match) => match.toUpperCase());
  }

  private getDescription(content: string) {
    const splited = content.split('>');
    const firstBlock =
      splited.length > 1
        ? splited[0].includes('<')
          ? splited[1].split('<')[0]
          : splited[0]
        : splited[0];
    return firstBlock.substring(0, 256);
  }

  /**
   * Puede asignar las meta tags de título específicamente para el SEO
   *
   * @param {string} title El texto que asignará como título SEO
   */
  setTitleTags(title: string) {
    const tag = this.meta.getTag('name="twitter:title"');
    this.setTitle(title);
    if (tag) {
      this.meta.updateTag({ name: 'twitter:title', content: title });
      this.meta.updateTag({ property: `og:title`, content: title });
    } else {
      this.meta.addTag({ name: 'twitter:title', content: title });
      this.meta.addTag({ property: 'og:title', content: title });
    }
  }

  /**
   * Permite crear cualquier meta tag con el contenido y la función deseada
   *
   * @param {string} name
   * @param {string} content
   */
  setMetaTag(name: string, content: string) {
    const tag = this.meta.getTag(`name="${name}"`);
    if (!tag) {
      this.meta.addTag({ name, content });
      this.meta.addTag({ name: `twitter:${name}`, content });
      this.meta.addTag({ property: `og:${name}`, content: content });
    } else {
      this.meta.updateTag({ name: name, content: content });
      this.meta.updateTag({ name: `twitter:${name}`, content: content });
      this.meta.updateTag({ property: `og:${name}`, content: content });
    }
  }

  setKeywords(keywords: string) {
    const tag = this.meta.getTag(`name="keywords"`);
    if (!tag) {
      this.meta.addTag({ name: 'keywords', content: keywords });
    } else {
      this.meta.updateTag({ name: 'keywords', content: keywords });
    }
  }

  setSlug(slug: string, host?: string) {
    if (!host) {
      const splited = this.location.href.split('/');
      host = splited[0].includes('http') ? `${splited[0]}//${splited[2]}` : splited[0];
    }
    const tag = this.meta.getTag(`name="og:slug"`);
    if (!tag) {
      this.meta.addTag({ name: 'og:slug', content: `${host}/${slug}` });
    } else {
      this.meta.updateTag({ name: 'og:slug', content: `${host}/${slug}` });
    }
  }

  /**
   * Permite capitalizar en typescript
   *
   * @param {string} text Texto a modificar
   * @param {boolean} [lower=false] Permite minimizar todo el texto primero antes de capitalizar.
   * @returns {*}
   */
  capitalize(text: string, lower = false) {
    return (lower ? text.toLowerCase() : text).replace(/(?:^|\s|["'([{])+\S/g, (match) =>
      match.toUpperCase()
    );
  }

  setTitle(text: string) {
    this.title.setTitle(this.capitalize(text));
  }

  /**
   * Inject the State into the bottom of the <head>
   */
  addLinkTag(tag: LinkDefinition) {
    try {
      const renderer = this.renderFac.createRenderer(this.document, {
        id: '-1',
        encapsulation: ViewEncapsulation.None,
        styles: [],
        data: {}
      });

      const link = renderer.createElement('link');
      const head = this.document.head;

      if (head === null) {
        throw new Error('<head> not found within DOCUMENT.');
      }

      Object.keys(tag).forEach((prop: string) => {
        renderer.setAttribute(link, prop, tag[prop]);
      });

      renderer.appendChild(head, link);
    } catch (e) {
      console.error('Error creating a link tag: ', e);
    }
  }

  setRobots(values: MetaRobotsValues[]) {
    this.setMetaTag('robots', values.join(', '));
  }
}
