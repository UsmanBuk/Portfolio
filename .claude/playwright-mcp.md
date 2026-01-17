# Playwright MCP Usage

The Playwright MCP is available for browser automation and testing.

## Available Tools

### Navigation
- `mcp__playwright__browser_navigate` - Navigate to a URL
- `mcp__playwright__browser_navigate_back` - Go back

### Page Inspection
- `mcp__playwright__browser_snapshot` - Get accessibility tree (preferred over screenshot for actions)
- `mcp__playwright__browser_take_screenshot` - Capture visual screenshot
- `mcp__playwright__browser_console_messages` - Get console logs

### Interactions
- `mcp__playwright__browser_click` - Click an element (use `ref` from snapshot)
- `mcp__playwright__browser_type` - Type text into an element
- `mcp__playwright__browser_fill_form` - Fill multiple form fields
- `mcp__playwright__browser_hover` - Hover over element
- `mcp__playwright__browser_press_key` - Press keyboard key
- `mcp__playwright__browser_select_option` - Select dropdown option

### Other
- `mcp__playwright__browser_wait_for` - Wait for text/time
- `mcp__playwright__browser_evaluate` - Run JavaScript on page
- `mcp__playwright__browser_tabs` - Manage browser tabs
- `mcp__playwright__browser_close` - Close browser

## Typical Workflow

1. Start a local server first:
   ```bash
   python3 -m http.server 10000  # Use python3, not python
   ```

2. Navigate to the page:
   ```
   mcp__playwright__browser_navigate url=http://localhost:10000
   ```

3. Get page structure (use snapshot, not screenshot, for interactions):
   ```
   mcp__playwright__browser_snapshot
   ```

4. Interact using `ref` values from snapshot:
   ```
   mcp__playwright__browser_click element="About button" ref="e49"
   ```

## Notes

- Snapshot returns a YAML accessibility tree with `ref` attributes for each element
- Use these `ref` values when clicking, typing, etc.
- Check console messages for JS errors after page load
- Port 8000 may be in use by other projects - use 10000 for this portfolio
