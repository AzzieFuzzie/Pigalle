import "dotenv/config";
import * as prismic from "@prismicio/client";
import { asHTML } from "@prismicio/client";

const PRISMIC_REPO = process.env.PRISMIC_REPOSITORY;
const PRISMIC_TOKEN = process.env.PRISMIC_ACCESS_TOKEN;

const client = prismic.createClient(PRISMIC_REPO, {
  accessToken: PRISMIC_TOKEN,
});


export default async function () {
  // const navigation = await client.getSingle("navigation");
  const home = await client.getSingle("home");
  const menu = await client.getSingle("menu");
  const about = await client.getSingle("about");
  const contact = await client.getSingle("contact");
  const book = await client.getSingle("book");
  const footer = await client.getSingle("footer");

  // Rich Text
  const aboutHeadingsHTML = about.data.body
    .filter(slice => slice.slice_type === 'intro_card')
    .map(slice => asHTML(slice.primary.heading).replace(/\n/g, '<br>'));



  const homeHeadingsHTML = home.data.body
    .filter(slice => slice.slice_type === 'hero_card')
    .map(slice => asHTML(slice.primary.heading).replace(/\n/g, '<br>'));


  return { home, menu, about, contact, book, footer, homeHeadingsHTML, aboutHeadingsHTML };

}

