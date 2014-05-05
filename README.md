# dotHIV Click Counters

Source code for the overlays providing visual feedback to visitors of .HIV domains.

See http://dothiv.github.io/banner/ for a demo.

## Installation

After cloning the repo, `npm install` in the repo's root directory installs all required *node* dependencies.

## Building

The banner project is configured to build four files:
 - `banner.js`, the javascript file that needs to be included into target website
 - `banner-center.html`, the HTML file that will be loaded for the *center* banner
 - `banner-top.html`, the HTML file that will be loaded for the *top* banner
 - `banner-right.html`, the HTML file that will be loaded for the *right* banner

The minified versions of these files can be built with `./node_modules/grunt-cli/bin/grunt` in the repo's root directory.

An alternative, non-minified version for debugging purposes can be built with `./node_modules/grunt-cli/bin/grunt debug`. This version also generates a test page. For testing the three different layouts, append `#center`, `#right` or `#left` to the `build/test-page.html`.

## Deployment

Internally, the banner project relies on resources placed in the following locations:
 - `banner.js` must be available at http://dothiv-registry.appspot.com/static/banner.min.js
 - `banner-*.html` files must be available at http://dothiv-registry.appspot.com/static/banner-*.html

## Configuration

Once deployed, a JSON config object will be requested each time the banner is shown which contains plain values and strings formatted according to the domains language setting.

See [this sample config object](src/demo.json) for reference.

<table>
<thead>
<tr>
<th>Property</th>
<th>Type</th>
<th>Example</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr><td><code>percent</code></td><td><code>float</code></td><td><code>0.25</code></td><td>The donation status in percent between 0 and 1. Rendered as width of the pink bar (as percentage)</td></tr>
<tr><td><code>money</code></td><td><code>string</code></td><td><code>36.294,28 &euro;</code></td><td>The current amount of donated/activated money</td></tr>
<tr><td><code>clickcount</code></td><td><code>string</code></td><td><code>36.294.280 Klicks</code></td><td>The current count of clicks</td></tr>
<tr><td><code>firstvisit</code></td><td><code>string</code></td><td><code>center</code></td><td>The position of the banner (<code>center</code>, <code>top</code> or <code>right</code>) on the first visit of the target website</td></tr>
<tr><td><code>secondvisit</code></td><td><code>string</code></td><td><code>right</code></td><td>The position of the banner on subsequent visits of the target website</td></tr>
<tr><td><code>heading</code></td><td><code>string</code></td><td><code>Danke!</code></td><td>This string will be rendered as heading of the banner</td></tr>
<tr><td><code>subheading</code></td><td><code>string</code></td><td><code>Jeder Klick hilft mit 0,1 ct</code></td><td>This string will be the subheading of the banner</td></tr>
<tr><td><code>about</code></td><td><code>string</code></td><td><code>Dieses Projekt wird unterstützt</code></td><td>String for project info</td></tr>
<tr><td><code>activated</code></td><td><code>string</code></td><td><code>Mehr über die &lt;strong&gt;dotHIV&lt;/strong&gt; Initiative</code></td><td>String for project info</td></tr>
<tr><td><code>locale</code></td><td><code>string</code></td><td><code>de</code></td><td>Locale setting of the domain</td></tr>
<tr><td><code>unlocked</code></td><td><code>float</code></td><td><code>36294.28</code></td><td>Amount of money unlocked in current stretch</td></tr>
<tr><td><code>clicks</code></td><td><code>float</code></td><td><code>36294280</code></td><td>Amount of clicks in current stretch</td></tr>
<tr><td><code>donated</code></td><td><code>float</code></td><td><code>2370000.0</code></td><td>Amount of money donated in previous stretches</td></tr>
<tr><td><code>increment</code></td><td><code>float</code></td><td><code>0.001</code></td><td>Increment per click</td></tr>
</tbody>
</table>

### Communication

Each time the target website is visited, the banner javascript sends a POST request to http://dothiv-registry.appspot.com/c. With this request, the following parameters will be transmitted:

 - `from`: possible values are `outside` or `iframe`, determining where the request was sent from
 - `firstvisit`: boolean value indicating whether this was the first visit on this website
 - `domain`: the visited domain

Thus, a complete POST request could look like this:

```
POST http://dothiv-registry.appspot.com/c?from=outside&firstvisit=false&domain=example.hiv
```

The application answering this request is expected to return a valid configuration object as described above.
