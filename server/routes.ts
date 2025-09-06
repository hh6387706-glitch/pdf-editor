import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { convertFileSchema, type ConversionResult } from "@shared/schema";
import { z } from "zod";
import xml2js from "xml2js";

// Set up multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/xml' || file.mimetype === 'application/xml' || file.originalname.toLowerCase().endsWith('.xml')) {
      cb(null, true);
    } else {
      cb(new Error('Only XML files are allowed'));
    }
  }
});

function convertWordPressToBlogger(wordpressXml: string): Promise<string> {
  return new Promise((resolve, reject) => {
    xml2js.parseString(wordpressXml, { explicitArray: false }, (err, result) => {
      if (err) {
        reject(new Error('Invalid XML format: ' + err.message));
        return;
      }

      try {
        const rss = result.rss;
        if (!rss || !rss.channel) {
          throw new Error('Invalid WordPress export format - missing RSS channel');
        }

        const channel = rss.channel;
        const items = Array.isArray(channel.item) ? channel.item : (channel.item ? [channel.item] : []);
        
        // Filter only posts and pages
        const posts = items.filter((item: any) => {
          const postType = item['wp:post_type'];
          return postType === 'post' || postType === 'page';
        });

        // Convert categories to labels
        const categories = new Set();
        posts.forEach((post: any) => {
          if (post.category) {
            const cats = Array.isArray(post.category) ? post.category : [post.category];
            cats.forEach((cat: any) => {
              if (typeof cat === 'string') {
                categories.add(cat);
              } else if (cat && cat._) {
                categories.add(cat._);
              }
            });
          }
        });

        // Build Blogger XML
        const bloggerXml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:openSearch="http://a9.com/-/spec/opensearch/1.1/" xmlns:blogger="http://schemas.google.com/blogger/2008" xmlns:georss="http://www.georss.org/georss" xmlns:gd="http://schemas.google.com/g/2005" xmlns:thr="http://purl.org/syndication/thread/1.0">
  <id>tag:blogger.com,1999:blog-${Date.now()}</id>
  <updated>${new Date().toISOString()}</updated>
  <title type="text">${escapeXml(channel.title || 'Converted Blog')}</title>
  <subtitle type="html">${escapeXml(channel.description || 'Converted from WordPress')}</subtitle>
  <link rel="http://schemas.google.com/g/2005#feed" type="application/atom+xml" href="http://example.blogspot.com/feeds/posts/default"/>
  <link rel="self" type="application/atom+xml" href="http://example.blogspot.com/feeds/posts/default"/>
  <link rel="alternate" type="text/html" href="http://example.blogspot.com/"/>
  <author>
    <name>${escapeXml(channel['dc:creator'] || 'Blog Author')}</name>
  </author>
  <generator version="7.00" uri="https://www.blogger.com">Blogger</generator>
  <openSearch:totalResults>${posts.length}</openSearch:totalResults>
  <openSearch:startIndex>1</openSearch:startIndex>
  <openSearch:itemsPerPage>${posts.length}</openSearch:itemsPerPage>
${Array.from(categories).map((cat: any) => `  <category term="${escapeXml(cat)}"/>`).join('\n')}
${posts.map((post: any, index: number) => convertPostToBlogger(post, index)).join('\n')}
</feed>`;

        resolve(bloggerXml);
      } catch (error: any) {
        reject(new Error('Conversion failed: ' + error.message));
      }
    });
  });
}

function convertPostToBlogger(post: any, index: number): string {
  const postId = post['wp:post_id'] || (index + 1);
  const title = post.title || 'Untitled Post';
  const content = post['content:encoded'] || post.description || '';
  const pubDate = post.pubDate || post['wp:post_date'] || new Date().toISOString();
  const status = post['wp:status'] === 'publish' ? 'published' : 'draft';
  const postType = post['wp:post_type'] === 'page' ? 'page' : 'post';
  
  // Convert categories to labels
  let labels = '';
  if (post.category) {
    const cats = Array.isArray(post.category) ? post.category : [post.category];
    labels = cats.map((cat: any) => {
      const catName = typeof cat === 'string' ? cat : (cat._ || cat);
      return `    <category scheme="http://www.blogger.com/atom/ns#" term="${escapeXml(catName)}"/>`;
    }).join('\n');
  }

  return `  <entry>
    <id>tag:blogger.com,1999:blog-${Date.now()}.post-${postId}</id>
    <published>${new Date(pubDate).toISOString()}</published>
    <updated>${new Date(pubDate).toISOString()}</updated>
    <title type="text">${escapeXml(title)}</title>
    <content type="html">${escapeXml(content)}</content>
    <link rel="self" type="application/atom+xml" href="http://example.blogspot.com/feeds/posts/default/${postId}"/>
    <link rel="edit" type="application/atom+xml" href="http://example.blogspot.com/feeds/posts/default/${postId}"/>
    <link rel="alternate" type="text/html" href="http://example.blogspot.com/${postId}.html" title="${escapeXml(title)}"/>
    <author>
      <name>${escapeXml(post['dc:creator'] || 'Author')}</name>
    </author>
${labels}
    <blogger:status>${status}</blogger:status>
    <blogger:draft>false</blogger:draft>
  </entry>`;
}

function escapeXml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  app.post("/api/convert", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No file uploaded"
        });
      }

      const fileContent = req.file.buffer.toString('utf-8');
      
      try {
        const convertedXml = await convertWordPressToBlogger(fileContent);
        
        const result: ConversionResult = {
          success: true,
          filename: req.file.originalname.replace('.xml', '-blogger.xml'),
          content: Buffer.from(convertedXml).toString('base64')
        };

        res.json(result);
      } catch (conversionError: any) {
        res.status(400).json({
          success: false,
          error: conversionError.message
        });
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: "Server error: " + error.message
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
