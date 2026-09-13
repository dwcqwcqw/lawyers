import data from './insight-topics.json';
import { absolute } from './site';
export const insightTopics = data;
export const topicsUpdated = '2026-09-13';
export const findTopic = (slug: string) =>
  insightTopics.find((t) => t.slug === slug);
export const topicPath = (slug: string) => '/insights/topics/' + slug + '/';
export function directorySchema(
  id: string,
  items: { name: string; path: string }[],
) {
  return {
    '@type': 'ItemList',
    '@id': absolute(id),
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: absolute(item.path),
    })),
  };
}
