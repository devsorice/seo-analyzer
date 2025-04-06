-- CreateTable
CREATE TABLE "LighthouseReport" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "raw" JSONB NOT NULL,
    "performance" DOUBLE PRECISION,
    "accessibility" DOUBLE PRECISION,
    "bestPractices" DOUBLE PRECISION,
    "seo" DOUBLE PRECISION,

    CONSTRAINT "LighthouseReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "seoAudit" JSONB NOT NULL,
    "performanceAudit" JSONB NOT NULL,
    "accessibilityAudit" JSONB NOT NULL,
    "complianceAudit" JSONB NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageInformation" (
    "id" SERIAL NOT NULL,
    "pageId" INTEGER NOT NULL,
    "metaDescription" TEXT NOT NULL,
    "metaCanonical" TEXT NOT NULL,
    "ogTitle" TEXT NOT NULL,
    "ogDescription" TEXT NOT NULL,
    "ogImage" TEXT NOT NULL,
    "ogType" TEXT NOT NULL,
    "twitterCard" TEXT NOT NULL,
    "twitterTitle" TEXT NOT NULL,
    "twitterDescription" TEXT NOT NULL,
    "twitterImage" TEXT NOT NULL,
    "articlePublishedTime" TEXT NOT NULL,
    "articleModifiedTime" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "iconTag" TEXT NOT NULL,
    "sitemapLink" TEXT NOT NULL,
    "alternateLinks" TEXT[],
    "internalLinks" JSONB NOT NULL,
    "externalLinks" JSONB NOT NULL,
    "inSiteMap" BOOLEAN NOT NULL,
    "linkedFromAnotherPage" BOOLEAN NOT NULL,

    CONSTRAINT "PageInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lighthouse" (
    "id" SERIAL NOT NULL,
    "pageId" INTEGER NOT NULL,
    "result" JSONB NOT NULL,

    CONSTRAINT "Lighthouse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Page_url_key" ON "Page"("url");

-- CreateIndex
CREATE UNIQUE INDEX "PageInformation_pageId_key" ON "PageInformation"("pageId");

-- AddForeignKey
ALTER TABLE "PageInformation" ADD CONSTRAINT "PageInformation_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lighthouse" ADD CONSTRAINT "Lighthouse_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
