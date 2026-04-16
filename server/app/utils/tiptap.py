import json

def extract_text(node):
    """
    Recursively extracts plain text from a TipTap/Custom Block JSON node.
    """
    if not node:
        return ""
    
    # If node is a list (custom block array)
    if isinstance(node, list):
        return " ".join([extract_text(n) for n in node])
    
    # Standard TipTap Text Node
    if node.get('type') == 'text':
        return node.get('text', '')
    
    # Handle children (standard TipTap 'content' or Custom 'children')
    content = node.get('content') or node.get('children')
    if isinstance(content, list):
        return " ".join([extract_text(child) for child in content])
    
    # Handle custom 'text' block type or any block with a 'content' field that's a string
    if node.get('type') == 'text' and isinstance(node.get('content'), str):
        return node.get('content', '')
        
    return ""

def generate_excerpt(content_json, max_length=150):
    """
    Parses content JSON and generates a plain text excerpt.
    """
    if not content_json:
        return ""
        
    try:
        # If it's a string, parse it
        if isinstance(content_json, str):
            # Check if it looks like JSON
            if content_json.strip().startswith(('[', '{')):
                data = json.loads(content_json)
            else:
                # Fallback for plain HTML/Text content
                from markupsafe import Markup
                import re
                clean = re.sub('<[^<]+?>', '', content_json)
                text = clean[:max_length]
                return text + "..." if len(clean) > max_length else text
        else:
            data = content_json
            
        full_text = extract_text(data).strip()
        # Remove multiple spaces
        import re
        full_text = re.sub(r'\s+', ' ', full_text)
        
        if len(full_text) <= max_length:
            return full_text
            
        return full_text[:max_length].rsplit(' ', 1)[0] + "..."
    except Exception as e:
        print(f"Excerpt generation error: {e}")
        return ""
