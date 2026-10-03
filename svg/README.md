# Orange Logic SVG/XML parser canary matrix

This corpus uses only unique outbound callbacks to `https://ioczmasuxkcvwrggbffg1csnwsynanrej.oast.fun`. It does not request local files, cloud metadata, credentials, or private network resources.

An OAST callback is meaningful only when correlated with the request timing and User-Agent:

- `server-xml`: a callback during upload/transform can demonstrate XML external-resource processing.
- `stylesheet` and `svg-resource`: usually demonstrate renderer-side resource loading, which is SSRF-like but is not XXE by itself.
- `browser-active`: a callback after opening the returned SVG is browser behavior and must not be reported as server-side processing.
- `content-type` and `encoding`: parser-selection variants of the harmless general-entity canary.

| File | Class | Mechanism | Interpretation |
|---|---|---|---|
| [01-xxe-general-entity.svg](01-xxe-general-entity.svg) | server-xml | External general entity | A callback during upload/transform indicates external entity resolution. |
| [02-xxe-external-subset.svg](02-xxe-external-subset.svg) | server-xml | External DTD subset and general entity | Fetch of external-subset.dtd proves external subset loading; the numbered OAST callback proves its entity was expanded. |
| [03-xxe-parameter-entity.svg](03-xxe-parameter-entity.svg) | server-xml | Remote parameter entity DTD | GitHub Pages fetch plus numbered OAST callback indicates parameter-entity processing. |
| [04-xxe-public-id.svg](04-xxe-public-id.svg) | server-xml | PUBLIC external identifier with SYSTEM fallback | OAST callback indicates external subset retrieval through the system identifier. |
| [05-xinclude-xml.svg](05-xinclude-xml.svg) | server-xml | XInclude parse=xml | Callback during server processing indicates XInclude support. |
| [06-xinclude-text.svg](06-xinclude-text.svg) | server-xml | XInclude parse=text | Callback during server processing indicates XInclude text retrieval. |
| [07-xml-stylesheet.svg](07-xml-stylesheet.svg) | stylesheet | xml-stylesheet processing instruction | May be fetched by a renderer or browser; timing and User-Agent distinguish them. |
| [08-css-import.svg](08-css-import.svg) | stylesheet | CSS @import | Usually renderer/browser resource loading, not XXE. |
| [09-css-background.svg](09-css-background.svg) | stylesheet | CSS background-image URL | Usually renderer/browser resource loading, not XXE. |
| [10-css-font-face.svg](10-css-font-face.svg) | stylesheet | CSS @font-face URL | A renderer may fetch the font when laying out text. |
| [11-image-href.svg](11-image-href.svg) | svg-resource | SVG 2 image href | Renderer or browser external-image request. |
| [12-image-xlink.svg](12-image-xlink.svg) | svg-resource | SVG 1.1 image xlink:href | Renderer or browser external-image request. |
| [13-use-href.svg](13-use-href.svg) | svg-resource | External use href | Renderer/browser external SVG-document request. |
| [14-use-xlink.svg](14-use-xlink.svg) | svg-resource | External use xlink:href | Legacy renderer/browser external SVG-document request. |
| [15-feimage.svg](15-feimage.svg) | svg-resource | Filter feImage href | Image renderer may fetch while evaluating the filter. |
| [16-script-href.svg](16-script-href.svg) | browser-active | SVG script href | Normally browser document-mode only; this is not XXE. |
| [17-script-xlink.svg](17-script-xlink.svg) | browser-active | Legacy SVG script xlink:href | Normally browser document-mode only; this is not XXE. |
| [18-foreignobject-img.svg](18-foreignobject-img.svg) | browser-active | foreignObject HTML img | Browser or HTML-capable renderer request. |
| [19-foreignobject-iframe.svg](19-foreignobject-iframe.svg) | browser-active | foreignObject HTML iframe | Typically browser document-mode only. |
| [20-foreignobject-object.svg](20-foreignobject-object.svg) | browser-active | foreignObject HTML object | Typically browser document-mode only. |
| [21-video-href.svg](21-video-href.svg) | svg-resource | HTML video in foreignObject | Browser or multimedia-capable renderer request. |
| [22-audio-href.svg](22-audio-href.svg) | svg-resource | HTML audio in foreignObject | Browser or multimedia-capable renderer request. |
| [23-cursor-href.svg](23-cursor-href.svg) | svg-resource | CSS cursor URL | Interactive browser-only in most implementations. |
| [24-xml-base-relative-image.svg](24-xml-base-relative-image.svg) | svg-resource | xml:base plus relative image URL | Tests base-URI resolution by a renderer. |
| [25-xxe-mime-xml.xml](25-xxe-mime-xml.xml) | content-type | General entity with .xml extension | Same XML construct served under an XML-oriented MIME type. |
| [26-xxe-mime-text.txt](26-xxe-mime-text.txt) | content-type | General entity with .txt extension | Tests whether the receiver sniffs XML despite text/plain. |
| [27-xxe-mime-html.html](27-xxe-mime-html.html) | content-type | General entity with .html extension | Tests whether the receiver parses by content rather than MIME. |
| [28-xxe-uppercase.SVG](28-xxe-uppercase.SVG) | content-type | Uppercase SVG extension | Tests case-sensitive extension filters. |
| [29-xxe-utf8-bom.svg](29-xxe-utf8-bom.svg) | encoding | UTF-8 BOM plus general entity | Tests BOM-tolerant XML parsing. |
| [30-xxe-utf16le.svg](30-xxe-utf16le.svg) | encoding | UTF-16LE BOM plus general entity | Tests UTF-16LE XML parsing. |
| [31-xxe-utf16be.svg](31-xxe-utf16be.svg) | encoding | UTF-16BE BOM plus general entity | Tests UTF-16BE XML parsing. |
| [32-xxe-compressed.svgz](32-xxe-compressed.svgz) | encoding | Gzip-compressed SVG with general entity | Tests SVGZ decompression followed by XML parsing. |
| [33-pure-xml-general.xml](33-pure-xml-general.xml) | server-xml | Generic XML external general entity | A callback during submission demonstrates entity expansion by a generic XML parser. |
| [34-pure-xml-external-dtd.xml](34-pure-xml-external-dtd.xml) | server-xml | Generic XML external DTD | A fetch of the DTD and then its numbered OAST path demonstrates external-subset processing. |
| [35-pure-xml-xinclude.xml](35-pure-xml-xinclude.xml) | server-xml | Generic XML XInclude | A callback demonstrates an XInclude processing stage, which is separate from ordinary XML parsing. |
| [36-soap-xxe.xml](36-soap-xxe.xml) | server-xml | SOAP-shaped XML external entity | Tests applications that select a SOAP parser based on document structure. |
| [37-rss-xxe.xml](37-rss-xxe.xml) | server-xml | RSS-shaped XML external entity | Tests feed/import processors; callback indicates server-side entity expansion. |
| [38-xhtml-xxe.xhtml](38-xhtml-xxe.xhtml) | server-xml | XHTML-shaped XML external entity | Tests XML-mode XHTML parsing rather than HTML parsing. |
| [39-pure-xml-stylesheet.xml](39-pure-xml-stylesheet.xml) | stylesheet | Generic XML stylesheet processing instruction | Usually indicates a renderer or browser stage, not entity expansion. |
| [external-subset.dtd](external-subset.dtd) | support | External DTD used by case 02 | Supporting DTD. |
| [parameter-entity.dtd](parameter-entity.dtd) | support | External parameter-entity DTD used by case 03 | Supporting DTD. |
| [pure-xml-external.dtd](pure-xml-external.dtd) | support | External DTD used by case 34 | Supporting DTD for the generic XML case. |
| [external-style.css](external-style.css) | support | External CSS callback | Supporting stylesheet. |
| [browser-script.js](browser-script.js) | support | Browser-only script callback | Supporting browser canary; not an XXE test. |

The authoritative machine-readable mapping is [manifest.json](manifest.json).
