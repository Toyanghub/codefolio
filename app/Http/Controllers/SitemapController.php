<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\URL;

class SitemapController extends Controller
{
    public function index()
    {
        $sitemap = $this->generateSitemap();
        
        return response($sitemap, 200)
            ->header('Content-Type', 'application/xml');
    }

    private function generateSitemap()
    {
        $urls = $this->getSitemapUrls();
        
        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . PHP_EOL;
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . PHP_EOL;
        
        foreach ($urls as $url) {
            $xml .= '  <url>' . PHP_EOL;
            $xml .= '    <loc>' . htmlspecialchars($url['loc']) . '</loc>' . PHP_EOL;
            $xml .= '    <lastmod>' . $url['lastmod'] . '</lastmod>' . PHP_EOL;
            $xml .= '    <changefreq>' . $url['changefreq'] . '</changefreq>' . PHP_EOL;
            $xml .= '    <priority>' . $url['priority'] . '</priority>' . PHP_EOL;
            $xml .= '  </url>' . PHP_EOL;
        }
        
        $xml .= '</urlset>';
        
        return $xml;
    }

    private function getSitemapUrls()
    {
        $baseUrl = URL::to('/');
        $currentDate = now()->toIso8601String();
        
        return [
            [
                'loc' => $baseUrl,
                'lastmod' => $currentDate,
                'changefreq' => 'daily',
                'priority' => '1.0',
            ],
            [
                'loc' => $baseUrl . '/observatory',
                'lastmod' => $currentDate,
                'changefreq' => 'daily',
                'priority' => '0.9',
            ],
            [
                'loc' => $baseUrl . '/works',
                'lastmod' => $currentDate,
                'changefreq' => 'weekly',
                'priority' => '0.8',
            ],
            [
                'loc' => $baseUrl . '/contact',
                'lastmod' => $currentDate,
                'changefreq' => 'monthly',
                'priority' => '0.7',
            ],
            [
                'loc' => $baseUrl . '/privacy-policy',
                'lastmod' => $currentDate,
                'changefreq' => 'monthly',
                'priority' => '0.5',
            ],
            [
                'loc' => $baseUrl . '/terms-of-service',
                'lastmod' => $currentDate,
                'changefreq' => 'monthly',
                'priority' => '0.5',
            ],
        ];
    }
}
