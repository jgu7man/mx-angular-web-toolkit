const functions = require('firebase-functions');
const { firebaseServicesPromise } = require('./firebase/config');

/**
 * SSR website
 */
const website = require(`${process.cwd()}/dist/server/main`).app();
exports.ssrwebsite = functions.https.onRequest(website);

/** 
 * Sitemap generator
 */
exports.sitemap = functions.https.onRequest(async (req, res) => {
  try {
    const { db } = await firebaseServicesPromise;
    const baseDomain = 'https://tiendalasmotos.com'

    const pagesUrlList = [
      `${baseDomain}`,
      `${baseDomain}/catalogo`,
      `${baseDomain}/blog`,
      `${baseDomain}/creditos`,
      `${baseDomain}/politica-de-privacidad`,
      `${baseDomain}/sedes`,
      `${baseDomain}/creditos/simulator`
    ]

    const postsPath = 'pagina/blog/posts'
    const posts = (await db.collection(postsPath).get()).docs.map(doc => doc.data())
    const postUrlList = posts.map(post => `${baseDomain}/post/${post.idEntrada}`)

    const motosPath = 'catalogo'
    const motos = (await db.collection(motosPath).get()).docs.map(doc => doc.data())
    const motoUrlList = motos.map(moto => `${baseDomain}/moto/${moto.id}`)

    const sitemap = [
      ...pagesUrlList,
      ...postUrlList,
      ...motoUrlList
    ].join('\n')

    res.send(sitemap)
  } catch (error) {
    console.error('Error generating sitemap:', error)
    res.status(500).send('Error generating sitemap')
  }
});