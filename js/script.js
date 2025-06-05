// Function to open a new window/tab with detailed explanation
// Mapping of tag-based file names to actual detail file names
const pageFileMap = {
    'form.html': 'forms_details.html',
    'input.html': 'forms_details.html',
    'button.html': 'forms_details.html',
    'select.html': 'forms_details.html',
    'textarea.html': 'forms_details.html',
    'label.html': 'forms_details.html',
    'fieldset.html': 'forms_details.html',
    'legend.html': 'forms_details.html',

    'ul.html': 'lists_details.html',
    'ol.html': 'lists_details.html',
    'li.html': 'lists_details.html',
    'dl.html': 'lists_details.html',
    'dt.html': 'lists_details.html',
    'dd.html': 'lists_details.html',

    'img.html': 'multimedia_details.html',
    'audio.html': 'multimedia_details.html',
    'video.html': 'multimedia_details.html',
    'source.html': 'multimedia_details.html',
    'track.html': 'multimedia_details.html',
    'canvas.html': 'multimedia_details.html',
    'svg.html': 'multimedia_details.html',
    'picture.html': 'multimedia_details.html',
    'iframe.html': 'multimedia_details.html',
    'figure.html': 'multimedia_details.html',

    'header.html': 'semantic_details.html',
    'footer.html': 'semantic_details.html',
    'main.html': 'semantic_details.html',
    'article.html': 'semantic_details.html',
    'section.html': 'semantic_details.html',
    'aside.html': 'semantic_details.html',
    'nav.html': 'semantic_details.html',

    'table.html': 'tables_details.html',
    'tr.html': 'tables_details.html',
    'td.html': 'tables_details.html',
    'th.html': 'tables_details.html',
    'thead.html': 'tables_details.html',
    'tbody.html': 'tables_details.html',
    'tfoot.html': 'tables_details.html',
    'caption.html': 'tables_details.html',

    'html.html': 'tag_document_structure.html',
    'head.html': 'tag_document_structure.html',
    'body.html': 'tag_document_structure.html',
    'title.html': 'tag_document_structure.html',
    'meta.html': 'tag_document_structure.html',
    'link.html': 'tag_document_structure.html',
    'style.html': 'tag_document_structure.html',
    'script.html': 'tag_document_structure.html',

    'h1-h6.html': 'text_formatting_details.html',
    'p.html': 'text_formatting_details.html',
    'span.html': 'text_formatting_details.html',
    'div.html': 'text_formatting_details.html',
    'br.html': 'text_formatting_details.html',
    'hr.html': 'text_formatting_details.html',
    'pre.html': 'text_formatting_details.html',
    'code.html': 'text_formatting_details.html'
};

// Function to open the mapped detail file
function openDetailPage(fileName) {
    event.preventDefault();

    // Normalize if it's a full path like 'pages/input.html'
    const shortFile = fileName.split('/').pop();

    // Get actual file name from map or fallback to input
    const resolvedFile = pageFileMap[shortFile] || shortFile;

    window.open(`pages/${resolvedFile}`, '_blank');
}

// Function to open a detailed tag explanation page
function openTagDetailPage(tagName) {
    // Prevent the default link behavior if event exists
    if (event) {
        event.preventDefault();
    }
    
    // Format tag name for file naming (remove < and > characters)
    const formattedTagName = tagName.replace(/[<>]/g, '');
    
    // Generate file name based on tag name
    const fileName = `pages/tag_${formattedTagName}.html`;
    
    // Check if the file exists, otherwise generate dynamic content
    fetch(fileName)
        .then(response => {
            if (response.ok) {
                // If file exists, open it
                window.open(fileName, '_blank');
            } else {
                // If file doesn't exist, create dynamic content
                const content = generateTagDetailContent(tagName);
                
                // Use a temporary blob to open content in a new tab
                const blob = new Blob([content], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                
                // Open the detailed explanation page in a new window
                window.open(url, '_blank');
            }
        })
        .catch(() => {
            // If fetch fails, fallback to dynamic content
            const content = generateTagDetailContent(tagName);
            const blob = new Blob([content], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        });
}

// Function to generate detailed content for a specific tag
function generateTagDetailContent(tagName) {
    // Get the tag info from the current page
    const tagSection = document.querySelector(`h3:contains("${tagName}")`);
    let tagInfo = "";
    let tagAttributes = [];
    let tagExample = "";
    
    if (tagSection) {
        // Get the parent article element
        const article = tagSection.closest('article');
        
        // Extract all content from the article
        tagInfo = article.innerHTML;
        
        // Try to extract attributes list if it exists
        const attrList = article.querySelector('ul');
        if (attrList) {
            const attrs = attrList.querySelectorAll('li');
            attrs.forEach(attr => {
                tagAttributes.push(attr.textContent);
            });
        }
        
        // Try to extract example
        const examplePre = article.querySelector('pre');
        if (examplePre) {
            tagExample = examplePre.textContent;
        }
    }
    
    // Generate the HTML content for the detailed page
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${tagName} - HTML Tag Detailed Reference</title>
    <link rel="stylesheet" href="../css/styles.css">
</head>
<body>
    <header>
        <h1>${tagName} - HTML Tag Reference</h1>
        <p>Detailed documentation and usage guide</p>
    </header>
    
    <section>
        <h2>Overview</h2>
        <p>${getTagDescription(tagName)}</p>
        
        <div class="compatibility">
            <h3>Browser Compatibility</h3>
            <p>This tag is supported in all modern browsers.</p>
        </div>
    </section>
    
    <section>
        <h2>Attributes</h2>
        ${generateAttributesHTML(tagName)}
    </section>
    
    <section>
        <h2>Examples</h2>
        <div class="example-section">
            <h3>Basic Usage</h3>
            <pre>${getTagExample(tagName)}</pre>
        </div>
    </section>
    
    <section>
        <h2>Best Practices</h2>
        <ul>
            ${generateBestPractices(tagName)}
        </ul>
    </section>
    
    <section>
        <h2>Related Tags</h2>
        <ul>
            ${generateRelatedTags(tagName)}
        </ul>
    </section>
    
    <a href="javascript:window.close()" class="back-button">Close and Return to Reference Guide</a>
    
    <script src="../js/script.js"></script>
</body>
</html>`;
}

// Helper functions to provide tag data
function getTagDescription(tagName) {
    // This would ideally come from a database or more detailed source
    const descriptions = {
        "<div>": "The <div> element is a generic container for flow content. It has no effect on the content or layout until styled using CSS. It's one of the most commonly used HTML elements for grouping and applying styles to sections of content.",
        "<p>": "The <p> element represents a paragraph of text. Browsers automatically add margin before and after each <p> element. It's one of the most basic and frequently used HTML elements for text content.",
        "<a>": "The <a> (anchor) element creates hyperlinks to other web pages, files, locations within the same page, email addresses, or any other URL. It's the primary element for navigation on the web.",
        "<img>": "The <img> element embeds an image into the document. It is an empty element that requires no closing tag but must include the src attribute to specify the image source and the alt attribute for accessibility.",
        "<form>": "The <form> element represents a document section containing interactive controls for submitting information. It's the container for various input elements like text fields, checkboxes, radio buttons, and submit buttons.",
        "<html>": "The <html> element is the root element of an HTML document. All other elements must be descendants of this element.",
        "<head>": "The <head> element contains machine-readable information (metadata) about the document, like its title, scripts, and style sheets.",
        "<body>": "The <body> element contains all the contents of an HTML document, such as headings, paragraphs, images, hyperlinks, tables, lists, etc.",
        "<h1>": "The <h1> to <h6> elements represent six levels of section headings. <h1> is the highest section level and <h6> is the lowest.",
        "<br>": "The <br> element produces a line break in text. It is useful for writing a poem or an address, where the division of lines is significant.",
        "<table>": "The <table> element represents tabular data — that is, information presented in a two-dimensional table comprised of rows and columns of cells.",
        "<ul>": "The <ul> element represents an unordered list of items, typically rendered as a bulleted list.",
        "<ol>": "The <ol> element represents an ordered list of items, typically rendered as a numbered list.",
        "<li>": "The <li> element is used to represent an item in a list. It must be contained in a parent element: an ordered list (<ol>), an unordered list (<ul>), or a menu (<menu>).",
        "<input>": "The <input> element is used to create interactive controls for web-based forms to accept data from the user.",
        "<button>": "The <button> element represents a clickable button, used to submit forms or anywhere in a document for accessible, standard button functionality."
    };
    
    return descriptions[tagName] || `The ${tagName} tag is a standard HTML element used for web page structure and content.`;
}

function generateAttributesHTML(tagName) {
    // This would ideally come from a database or more detailed source
    const attributes = {
        "<div>": [
            {name: "class", description: "Assigns one or more CSS class names to the element"},
            {name: "id", description: "Assigns a unique identifier to the element"},
            {name: "style", description: "Specifies inline CSS styles for the element"},
            {name: "title", description: "Provides additional information about the element, displayed as a tooltip"},
            {name: "data-*", description: "Allows custom data attributes to be stored in the HTML"},
        ],
        "<p>": [
            {name: "class", description: "Assigns one or more CSS class names to the element"},
            {name: "id", description: "Assigns a unique identifier to the element"},
            {name: "style", description: "Specifies inline CSS styles for the element"},
            {name: "title", description: "Provides additional information about the element, displayed as a tooltip"},
            {name: "dir", description: "Specifies the text direction for the content in an element"},
            {name: "lang", description: "Specifies the language of the element content"},
        ],
        "<a>": [
            {name: "href", description: "Specifies the URL of the page the link goes to"},
            {name: "target", description: "Specifies where to open the linked document (_blank, _self, _parent, _top)"},
            {name: "download", description: "Specifies that the target will be downloaded when clicking on the link"},
            {name: "rel", description: "Specifies the relationship between the current document and the linked document"},
            {name: "hreflang", description: "Specifies the language of the linked document"},
            {name: "type", description: "Specifies the media type of the linked document"},
        ],
        "<img>": [
            {name: "src", description: "Required. Specifies the path to the image"},
            {name: "alt", description: "Required. Specifies alternative text for the image"},
            {name: "width", description: "Specifies the width of the image"},
            {name: "height", description: "Specifies the height of the image"},
            {name: "loading", description: "Specifies whether the browser should load the image immediately or to defer loading until some conditions are met"},
        ],
        "<form>": [
            {name: "action", description: "Specifies where to send the form-data when a form is submitted"},
            {name: "method", description: "Specifies the HTTP method to use when sending form-data"},
            {name: "enctype", description: "Specifies how the form-data should be encoded when submitting it to the server"},
            {name: "target", description: "Specifies where to display the response after submitting the form"},
            {name: "autocomplete", description: "Specifies whether a form should have autocomplete on or off"},
        ],
    };
    
    const tagAttrs = attributes[tagName] || [];
    
    if (tagAttrs.length === 0) {
        return "<p>This tag uses standard global attributes.</p>";
    }
    
    let html = "<table class='attribute-table'><tr><th>Attribute</th><th>Description</th></tr>";
    
    tagAttrs.forEach(attr => {
        html += `<tr><td class="attribute-name">${attr.name}</td><td>${attr.description}</td></tr>`;
    });
    
    html += "</table>";
    return html;
}

function getTagExample(tagName) {
    // This would ideally come from a database or more detailed source
    const examples = {
        "<div>": `<div class="container">
  <h2>Section Title</h2>
  <p>This is content inside a div container.</p>
</div>`,
        "<p>": `<p>This is a paragraph of text. It can contain <strong>bold text</strong>, 
<em>italic text</em>, and other inline elements.</p>`,
        "<a>": `<!-- External link -->
<a href="https://www.example.com" target="_blank">Visit Example.com</a>

<!-- Internal page link -->
<a href="about.html">About Us</a>

<!-- Email link -->
<a href="mailto:info@example.com">Email Us</a>`,
        "<img>": `<!-- Basic image -->
<img src="image.jpg" alt="Description of the image">

<!-- Image with width and height -->
<img src="logo.png" alt="Company Logo" width="200" height="100">

<!-- Responsive image -->
<img src="responsive.jpg" alt="Responsive image" style="max-width:100%; height:auto;">`,
        "<form>": `<form action="/submit-form" method="post">
  <label for="name">Name:</label>
  <input type="text" id="name" name="name" required>
  
  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required>
  
  <button type="submit">Submit</button>
</form>`,
    };
    
    return examples[tagName] || `<!-- Example of ${tagName} usage -->
${tagName}Example content</${tagName.replace("<", "</")}>`;
}

function generateBestPractices(tagName) {
    // This would ideally come from a database or more detailed source
    const practices = {
        "<div>": [
            "<li>Use semantic elements (<code>header</code>, <code>footer</code>, <code>section</code>, etc.) when appropriate instead of <code>div</code>.</li>",
            "<li>Avoid excessive nesting of <code>div</code> elements (\"div soup\").</li>",
            "<li>Use class names that describe the purpose rather than the appearance.</li>",
            "<li>Combine with CSS Grid or Flexbox for layout rather than float-based layouts.</li>",
        ],
        "<p>": [
            "<li>Don't use empty <code>p</code> tags for spacing (use CSS margins instead).</li>",
            "<li>Avoid nesting block elements inside <code>p</code> elements (not valid HTML).</li>",
            "<li>Use appropriate heading tags (<code>h1</code>-<code>h6</code>) before paragraphs to maintain document structure.</li>",
        ],
        "<a>": [
            "<li>Always include descriptive link text that makes sense out of context.</li>",
            "<li>Avoid generic phrases like \"click here\" or \"read more\" for link text.</li>",
            "<li>Use the <code>title</code> attribute to provide additional information when needed.</li>",
            "<li>Add <code>rel=\"noopener noreferrer\"</code> when using <code>target=\"_blank\"</code> for security.</li>",
        ],
    };
    
    return practices[tagName]?.join("") || 
          `<li>Follow standard HTML best practices.</li>
           <li>Ensure proper nesting with other elements.</li>
           <li>Include all required attributes.</li>
           <li>Follow accessibility guidelines when implementing this element.</li>`;
}

function generateRelatedTags(tagName) {
    // This would ideally come from a database or more detailed source
    const related = {
        "<div>": [
            "<li><code>&lt;section&gt;</code> - For thematic grouping of content</li>",
            "<li><code>&lt;article&gt;</code> - For self-contained content</li>",
            "<li><code>&lt;aside&gt;</code> - For content tangentially related to main content</li>",
            "<li><code>&lt;span&gt;</code> - Inline equivalent of div</li>",
        ],
        "<p>": [
            "<li><code>&lt;br&gt;</code> - Line break within text</li>",
            "<li><code>&lt;hr&gt;</code> - Thematic break between paragraphs</li>",
            "<li><code>&lt;div&gt;</code> - Generic container element</li>",
        ],
        "<a>": [
            "<li><code>&lt;button&gt;</code> - For actions that don't navigate to a new URL</li>",
            "<li><code>&lt;nav&gt;</code> - Container for navigation links</li>",
            "<li><code>&lt;link&gt;</code> - For linking to external resources in the head section</li>",
        ],
    };
    
    return related[tagName]?.join("") || 
          `<li>Global HTML elements</li>`;
}

// jQuery-like contains selector polyfill
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!document.querySelector('h3:contains')) {
    document.querySelectorAll = function(selector) {
        if (selector.includes(':contains')) {
            const containsText = selector.match(/:contains\("(.+?)"\)/)[1];
            const baseSelector = selector.split(':contains')[0];
            
            const elements = document.querySelectorAll(baseSelector);
            const result = Array.from(elements).filter(el => 
                el.textContent.includes(containsText)
            );
            
            return result;
        } else {
            return document.querySelectorAll(selector);
        }
    };
}

// Add click event listeners to all tag headings when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Find all tag headings
    const tagHeadings = document.querySelectorAll('article h3');
    
    // Add click event to each tag heading
    tagHeadings.forEach(heading => {
        // Extract tag name from heading text
        const tagName = heading.textContent;
        
        // Make the heading clickable
        heading.style.cursor = 'pointer';
        heading.title = `Click for detailed information about ${tagName}`;
        
        // Add click event
        heading.addEventListener('click', function() {
            openTagDetailPage(tagName);
        });
    });
});

