import { Dataset, createCheerioRouter } from 'crawlee';

export const router = createCheerioRouter();

router.addDefaultHandler(async ({ enqueueLinks, log }) => {
    log.info(`enqueueing new URLs`);
    await enqueueLinks({
        selector: 'div.page-navigation-container a.next'
    });
});

// router.addHandler('detail', async ({ request, $, log }) => {
//     const title = $('title').text();
//     log.info(`${title}`, { url: request.loadedUrl });

//     await Dataset.pushData({
//         url: request.loadedUrl,
//         title,
//     });
// });
