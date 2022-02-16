const fs = require('fs');

module.exports = {
  '*/10 * * * * *': async ({ strapi }) => {
    console.log('````````````````````````````````````````````````');

    const now = Math.floor(Date.now() / 1000);
    await processArticleWatingForPublish(now);
    await processArticleWatingForArchive(now);
    console.log('````````````````````````````````````````````````');
  },
};

async function processArticleWatingForPublish(now) {
  const draftArticleToPublish = await strapi.entityService.findMany('api::page.page', {
    fields: '*',
    filters: {
      publishedDate: null,
      schedulePublishDate: { $lte: now },
      stage: 'publish',
    },
    populate: '*',
  });

  console.log(draftArticleToPublish);

  if (draftArticleToPublish.length > 0) {
    const originalData = fs.readFileSync('.data/pages.json');
    const pages = JSON.parse(originalData);

    draftArticleToPublish.forEach(article => {
      const pageIndex = pages.findIndex(page => page.id === article.id);
      if (pageIndex > -1) {
        pages[pageIndex] = article;
      } else {
        pages.push(article);
      }

      strapi.entityService.update('api::page.page', article.id, {
        data: {
          publishedDate: now.toString(),
          stage: 'published',
        },
      });
    });

    fs.writeFileSync('.data/pages.json', JSON.stringify(pages));
  }
}

async function processArticleWatingForArchive(now) {
  const draftArticleToArchive = await strapi.entityService.findMany('api::page.page', {
    fields: ['id'],
    filters: {
      archivedDate: null,
      scheduleArchiveDate: { $lte: now },
    },
  });

  console.log(draftArticleToArchive);

  if (draftArticleToArchive.length > 0) {
    const originalData = fs.readFileSync('.data/pages.json');
    const pages = JSON.parse(originalData);

    draftArticleToArchive.forEach(article => {
      const pageIndex = pages.findIndex(page => page.id === article.id);
      if (pageIndex > -1) {
        pages.splice(pageIndex, 1);
      }

      strapi.entityService.update('api::page.page', article.id, {
        data: {
          archivedDate: now.toString(),
        },
      });
    });

    fs.writeFileSync('.data/pages.json', JSON.stringify(pages));
  }
}
