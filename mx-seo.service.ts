import { DOCUMENT } from "@angular/common";
import { Inject, Injectable, Renderer2, RendererFactory2 } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter, map } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class MxSEO {
	private render: Renderer2;

	constructor(
		private meta: Meta,
		private title: Title,
		private renderFac: RendererFactory2,
		@Inject(DOCUMENT) private document: any,
		private readonly router: Router,
		private readonly activatedRoute: ActivatedRoute
	) {
		this.render = this.renderFac.createRenderer(null, null);
		// this.setupRouting()
	}

	/**
	 * Cambia el título del documento (en la pestaña del navegador) a través de la data que se asigne en los doccumentos `routing-module.ts` como "title".
	 *
	 * @param {string} [prefix] OPCIONAL Puede asignarse un prefijo al titulo como el nombre global del sitio.
	 */
	updateTitle(prefix?: string) {
		this.router.events
			.pipe(
				filter(event => event instanceof NavigationEnd),
				map(() => this.activatedRoute),
				map(route => {
					let title;
					if (prefix) title = prefix;
					while (route.firstChild) {
						const data = route.firstChild.snapshot.data;
						title = title ? (data["title"] ? `${title} - ${data["title"]}` : title) : data["title"];
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
	 * @param {SEOCONFIG} config debe contener la configuración explícita
	 */
	setTags(config: SEOCONFIG) {
		config.keywords = !config.keywords ? (config.title ? config.title : "") : config.keywords;

		config.description = config.description ? config.description : "";
		config.image = config.image ? config.image : "";
		config.slug = config.slug ? config.slug : "";

		this.setTitleTags(config.title);
		this.setMetaTag("description", config.description.substring(0, 199));
		this.setMetaTag("image", config.image);

		this.setKeywords(config.keywords);
		this.setSlug(config.slug);
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
			this.meta.updateTag({ name: "twitter:title", content: title });
			this.meta.updateTag({ property: `og:title`, content: title });
		} else {
			this.renderMetaTag("twitter:title", title);
			this.renderMetaTag("og:title", title);
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
			this.renderMetaTag(name, content);
			this.renderMetaTag(`twitter:${name}`, content);
			this.renderMetaTag(`og:${name}`, content);
		} else {
			this.meta.updateTag({ name: name, content: content });
			this.meta.updateTag({ name: `twitter:${name}`, content: content });
			this.meta.updateTag({ property: `og:${name}`, content: content });
		}
	}

	setKeywords(keywords: string) {
		const tag = this.meta.getTag(`name="keywords"`);
		if (!tag) {
			this.renderMetaTag("keywords", keywords);
		} else {
			this.meta.updateTag({ name: "keywords", content: keywords });
		}
	}

	setSlug(slug: string, host?: string) {
		if (!host) {
			const splited = window.location.href.split("/");
			host = splited[0].includes("http") ? `${splited[0]}//${splited[2]}` : splited[0];
		}
		const tag = this.meta.getTag(`name="og:slug"`);
		if (!tag) {
			this.renderMetaTag("og:slug", `${host}/${slug}`);
		} else {
			this.meta.updateTag({ name: "og:slug", content: `${host}/${slug}` });
		}
	}

	renderMetaTag(name: string, content: string) {
		const meta = this.render.createElement("meta");
		if (name.includes("og")) {
			this.render.setAttribute(meta, "property", name);
		} else {
			meta.name = name;
		}
		meta.content = content;
		this.render.appendChild(document.head, meta);
	}

	/**
	 * Permite capitalizar en typescript
	 *
	 * @param {string} text Texto a modificar
	 * @param {boolean} [lower=false] Permite minimizar todo el texto primero antes de capitalizar.
	 * @returns {*}
	 */
	capitalize(text: string, lower = false) {
		return (lower ? text.toLowerCase() : text).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());
	}

	setTitle(text: string) {
		this.title.setTitle(this.capitalize(text));
	}
}

export interface SEOCONFIG {
	title: string;
	description?: string;
	keywords?: string;
	image?: string;
	slug?: string;
}
