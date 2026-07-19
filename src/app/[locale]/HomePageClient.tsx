"use client";

import { useState, Suspense, lazy } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  Eye,
  Flag,
  Gamepad2,
  Lightbulb,
  Map,
  Monitor,
  Newspaper,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.backalleytales.wiki";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Back Alley Tales Wiki",
        description:
          "Complete Back Alley Tales Wiki covering guides, characters, story, locations, items, mechanics, and gameplay tips for the dark narrative adventure game.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Back Alley Tales - Dark Narrative Adventure",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Back Alley Tales Wiki",
        alternateName: "Back Alley Tales",
        url: siteUrl,
        description:
          "Complete Back Alley Tales Wiki resource hub for guides, characters, story, locations, items, and gameplay strategies",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Back Alley Tales Wiki - Dark Narrative Adventure",
        },
        sameAs: [
          "https://www.youtube.com/@theworldhgames",
          "https://www.youtube.com/watch?v=1G11jn17J88",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Back Alley Tales",
        gamePlatform: ["PC", "Android"],
        applicationCategory: "Game",
        genre: ["Adventure", "Story", "Mystery"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 1,
        },
      },
      {
        "@type": "VideoObject",
        name: "Back Alley Tales (General Gameplay)",
        description:
          "Back Alley Tales gameplay preview featuring core exploration and narrative mechanics.",
        uploadDate: "2022-12-02",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/1G11jn17J88",
        url: "https://www.youtube.com/watch?v=1G11jn17J88",
      },
    ],
  };

  // Updates & News accordion state
  const [updatesExpanded, setUpdatesExpanded] = useState<number | null>(null);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("gameplay-guide")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://www.youtube.com/watch?v=1G11jn17J88"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section - 紧跟 Hero */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="1G11jn17J88"
              title="Back Alley Tales (General Gameplay)"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards（位于视频区之后、Latest Updates 之前）*/}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              // 映射卡片索引到 section ID（与下方 8 个模块一一对应）
              const sectionIds = [
                "gameplay-guide",
                "walkthrough",
                "secrets-locations",
                "characters-guide",
                "ending-guide",
                "tips-tricks",
                "system-requirements",
                "updates-news",
              ];
              const sectionId = sectionIds[index];

              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Updates Section（位于 Tools Grid 之后）*/}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 1: Gameplay Guide */}
      <section id="gameplay-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <Gamepad2 className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                {t.modules.backAlleyTalesGameplayGuide.title}
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.backAlleyTalesGameplayGuide.intro}
            </p>
          </div>

          {/* Steps */}
          <div className="scroll-reveal space-y-3 md:space-y-4 mb-8 md:mb-10">
            {t.modules.backAlleyTalesGameplayGuide.steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>

          {/* Quick Tips */}
          <div className="scroll-reveal p-4 md:p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <BookOpen className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-base md:text-lg">Quick Tips</h3>
            </div>
            <ul className="space-y-2">
              {t.modules.backAlleyTalesGameplayGuide.quickTips.map(
                (tip: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground text-sm">{tip}</span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Walkthrough（时间线）*/}
      <section
        id="walkthrough"
        className="scroll-mt-24 px-4 py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Map className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-4xl md:text-5xl font-bold">
                {t.modules.backAlleyTalesWalkthrough.title}
              </h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.backAlleyTalesWalkthrough.intro}
            </p>
          </div>
          <div className="scroll-reveal relative pl-6 border-l-2 border-[hsl(var(--nav-theme)/0.3)] space-y-8">
            {t.modules.backAlleyTalesWalkthrough.entries.map(
              (entry: any, index: number) => (
                <div key={index} className="relative">
                  <div className="absolute -left-[1.4rem] w-4 h-4 rounded-full bg-[hsl(var(--nav-theme))] border-2 border-background" />
                  <div className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                        {entry.type}
                      </span>
                      <Clock className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <h3 className="font-bold mb-1 text-lg">
                      {entry.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {entry.description}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 3: Secrets and Locations */}
      <section id="secrets-locations" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Eye className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-4xl md:text-5xl font-bold">
                {t.modules.backAlleyTalesSecretsLocations.title}
              </h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.backAlleyTalesSecretsLocations.intro}
            </p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {t.modules.backAlleyTalesSecretsLocations.cards.map(
              (card: any, index: number) => (
                <div
                  key={index}
                  className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <h3 className="font-bold text-lg mb-2 text-[hsl(var(--nav-theme-light))]">
                    {card.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {card.description}
                  </p>
                </div>
              ),
            )}
          </div>
          <div className="scroll-reveal grid grid-cols-2 md:grid-cols-4 gap-4">
            {t.modules.backAlleyTalesSecretsLocations.highlights.map(
              (h: string, i: number) => (
                <div
                  key={i}
                  className="p-4 bg-white/5 border border-border rounded-xl text-center hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <Check className="w-6 h-6 text-[hsl(var(--nav-theme-light))] mx-auto mb-2" />
                  <p className="text-sm">{h}</p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 4: Characters Guide */}
      <section
        id="characters-guide"
        className="scroll-mt-24 px-4 py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-4xl md:text-5xl font-bold">
                {t.modules.backAlleyTalesCharactersGuide.title}
              </h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.backAlleyTalesCharactersGuide.intro}
            </p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.backAlleyTalesCharactersGuide.creatures.map(
              (c: any, index: number) => (
                <div
                  key={index}
                  className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="mb-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]">
                      {c.role}
                    </span>
                  </div>
                  <h3 className="font-bold mb-2 text-lg">
                    {c.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {c.description}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 5: Ending Guide */}
      <section id="ending-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Flag className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-4xl md:text-5xl font-bold">
                {t.modules.backAlleyTalesEndingGuide.title}
              </h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.backAlleyTalesEndingGuide.intro}
            </p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {t.modules.backAlleyTalesEndingGuide.cards.map(
              (card: any, index: number) => (
                <div
                  key={index}
                  className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <h3 className="font-bold text-lg mb-2 text-[hsl(var(--nav-theme-light))]">
                    {card.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {card.description}
                  </p>
                </div>
              ),
            )}
          </div>
          <div className="scroll-reveal flex flex-wrap gap-3 justify-center">
            {t.modules.backAlleyTalesEndingGuide.milestones.map(
              (m: string, i: number) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm"
                >
                  <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                  {m}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 广告位 5: 中段阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 6: Tips and Tricks */}
      <section
        id="tips-tricks"
        className="scroll-mt-24 px-4 py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Lightbulb className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-4xl md:text-5xl font-bold">
                {t.modules.backAlleyTalesTipsTricks.title}
              </h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.backAlleyTalesTipsTricks.intro}
            </p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {t.modules.backAlleyTalesTipsTricks.cards.map(
              (card: any, index: number) => (
                <div
                  key={index}
                  className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <h3 className="font-bold text-lg mb-2 text-[hsl(var(--nav-theme-light))]">
                    {card.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {card.description}
                  </p>
                </div>
              ),
            )}
          </div>
          <div className="scroll-reveal flex flex-wrap gap-3 justify-center">
            {t.modules.backAlleyTalesTipsTricks.milestones.map(
              (m: string, i: number) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm"
                >
                  <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                  {m}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 7: System Requirements */}
      <section id="system-requirements" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Monitor className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-4xl md:text-5xl font-bold">
                {t.modules.backAlleyTalesSystemRequirements.title}
              </h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.backAlleyTalesSystemRequirements.intro}
            </p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.backAlleyTalesSystemRequirements.settings.map(
              (s: any, index: number) => (
                <div
                  key={index}
                  className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-bold text-lg">
                      {s.name}
                    </h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                      {s.type}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {s.description}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 8: Updates and News（手风琴）*/}
      <section
        id="updates-news"
        className="scroll-mt-24 px-4 py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Newspaper className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-4xl md:text-5xl font-bold">
                {t.modules.backAlleyTalesUpdatesNews.title}
              </h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.backAlleyTalesUpdatesNews.intro}
            </p>
          </div>
          <div className="scroll-reveal space-y-2">
            {t.modules.backAlleyTalesUpdatesNews.faqs.map(
              (faq: any, index: number) => (
                <div
                  key={index}
                  className="border border-border rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setUpdatesExpanded(updatesExpanded === index ? null : index)
                    }
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="font-semibold">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 transition-transform ${updatesExpanded === index ? "rotate-180" : ""}`}
                    />
                  </button>
                  {updatesExpanded === index && (
                    <div className="px-5 pb-5 text-muted-foreground text-sm">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://www.youtube.com/@theworldhgames"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=1G11jn17J88"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=ffDJMDl_qb4"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=-SlVJyw4zHs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
