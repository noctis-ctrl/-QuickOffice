
import React from 'react';
import { Table, FileText, Presentation, LayoutDashboard, BookOpen, Target, Settings, User, Type, Image as ImageIcon, Layout, ShieldCheck, Eye, Save, Calculator, BarChart, Database, Lock, Zap, TrendingUp, HelpCircle, Sparkles, MousePointer2, List, AlignCenter, Scissors, FileCode, Search, Image, PlaySquare, Columns, BookMarked, Layers } from 'lucide-react';
import { OfficeTool, Lesson, QuestionType, Question, Difficulty } from './types';

export const TOOLS_CONFIG = {
  Excel: {
    color: 'bg-green-600',
    borderColor: 'border-green-700',
    lightColor: 'bg-green-50',
    icon: <Table className="w-6 h-6" />,
    description: 'Master spreadsheets, data analysis, and advanced formulas.'
  },
  Word: {
    color: 'bg-blue-600',
    borderColor: 'border-blue-700',
    lightColor: 'bg-blue-50',
    icon: <FileText className="w-6 h-6" />,
    description: 'Create professional documents, reports, and layouts.'
  },
  PowerPoint: {
    color: 'bg-orange-600',
    borderColor: 'border-orange-700',
    lightColor: 'bg-orange-50',
    icon: <Presentation className="w-6 h-6" />,
    description: 'Design impactful presentations and visual stories.'
  }
};

const q = (id: string, cat: string, diff: Difficulty, prompt: string, opts: string[], correct: string, exp: string): Question => ({
  id, type: QuestionType.MULTIPLE_CHOICE, category: cat, difficulty: diff, prompt, options: opts, correctAnswer: correct, explanation: exp
});

const d = (id: string, cat: string, diff: Difficulty, prompt: string, order: string[], exp: string): Question => ({
  id, type: QuestionType.DRAG_DROP, category: cat, difficulty: diff, prompt, correctOrder: order, correctAnswer: 'ordered', explanation: exp
});

// WORD LESSONS
const wordLessons: Lesson[] = [
  {
    id: 'w1', title: 'Home: Styling & Text', tool: 'Word', xpReward: 50, stageTitle: 'Foundations',
    description: 'Master Font, Paragraph, and Clipboard.',
    questions: [
      q('w1q1', 'Home', Difficulty.EASY, 'Shortcut for Bold?', ['Ctrl+I', 'Ctrl+U', 'Ctrl+B', 'Ctrl+S'], 'Ctrl+B', 'Ctrl+B toggles Bold.'),
      q('w1q2', 'Home', Difficulty.EASY, 'Shortcut for Paste?', ['Ctrl+C', 'Ctrl+V', 'Ctrl+P', 'Ctrl+X'], 'Ctrl+V', 'Ctrl+V is Paste.'),
      q('w1q3', 'Home', Difficulty.EASY, 'Where is Font Color?', ['Font Group', 'Paragraph Group', 'Styles', 'Editing'], 'Font Group', 'Font color is in the Font group.'),
      q('w1q4', 'Home', Difficulty.EASY, 'Shortcut for Italics?', ['Ctrl+I', 'Ctrl+J', 'Ctrl+B', 'Ctrl+U'], 'Ctrl+I', 'Ctrl+I is Italics.'),
      q('w1q5', 'Home', Difficulty.INTERMEDIATE, 'Format Painter tool icon?', ['Paint Brush', 'Pencil', 'Paint Bucket', 'Highlighter'], 'Paint Brush', 'The yellow brush copies styles.'),
      q('w1q6', 'Home', Difficulty.INTERMEDIATE, 'Center Align shortcut?', ['Ctrl+C', 'Ctrl+E', 'Ctrl+L', 'Ctrl+R'], 'Ctrl+E', 'Ctrl+E centers text.'),
      q('w1q7', 'Home', Difficulty.INTERMEDIATE, 'What is "Justify" alignment?', ['Align to Left', 'Align to Center', 'Distribute evenly between margins', 'Align to Right'], 'Distribute evenly between margins', 'Justify makes clean straight edges on both sides.'),
      q('w1q8', 'Home', Difficulty.INTERMEDIATE, 'Change Case tool allows?', ['Changing text to UPPERCASE', 'Adding bullets', 'Changing font size', 'Printing'], 'Changing text to UPPERCASE', 'Aa icon manages case.'),
      q('w1q9', 'Home', Difficulty.DIFFICULT, 'A Hanging Indent is common in?', ['Titles', 'Bibliographies', 'Headers', 'Page Numbers'], 'Bibliographies', 'The first line is flush left, rest are indented.'),
      q('w1q10', 'Home', Difficulty.DIFFICULT, 'Clear All Formatting icon?', ['An Eraser over "A"', 'A Trash Can', 'A Red X', 'A White Brush'], 'An Eraser over "A"', 'Resets text to default.'),
      q('w1q11', 'Home', Difficulty.EASY, 'Shortcut for Underline?', ['Ctrl+U', 'Ctrl+B', 'Ctrl+I', 'Ctrl+S'], 'Ctrl+U', 'Underline text.'),
      q('w1q12', 'Home', Difficulty.EASY, 'Shortcut for Copy?', ['Ctrl+C', 'Ctrl+X', 'Ctrl+V', 'Ctrl+Z'], 'Ctrl+C', 'Copy selected content.'),
      q('w1q13', 'Home', Difficulty.INTERMEDIATE, 'Line Spacing 2.0 is called?', ['Single', 'Double', 'Multiple', 'Exact'], 'Double', 'Double the vertical space.'),
      q('w1q14', 'Home', Difficulty.INTERMEDIATE, 'Shortcut for Find?', ['Ctrl+F', 'Ctrl+H', 'Ctrl+G', 'Ctrl+N'], 'Ctrl+F', 'Search the document.'),
      q('w1q15', 'Home', Difficulty.DIFFICULT, 'What is the "Clipboard" pane?', ['Shows fonts', 'Holds up to 24 copied items', 'Shows page layout', 'Saves the file'], 'Holds up to 24 copied items', 'Advanced copy management.'),
      q('w1q16', 'Home', Difficulty.EASY, 'Bulleted list location?', ['Home Tab', 'Insert Tab', 'Layout Tab', 'View Tab'], 'Home Tab', 'Lists are paragraph tools.'),
      q('w1q17', 'Home', Difficulty.INTERMEDIATE, 'What does Ctrl+Y do?', ['Undo', 'Redo', 'Print', 'Save'], 'Redo', 'Reverses an undo action.'),
      q('w1q18', 'Home', Difficulty.DIFFICULT, 'Which tool handles Headings?', ['Font size', 'Styles', 'Page Setup', 'Review'], 'Styles', 'Styles ensure document hierarchy.'),
      q('w1q19', 'Home', Difficulty.EASY, 'Increase Font shortcut?', ['Ctrl+]', 'Ctrl+[', 'Ctrl+P', 'Ctrl+M'], 'Ctrl+]', 'Quickly scales font up.'),
      q('w1q20', 'Home', Difficulty.DIFFICULT, 'What is Superscript?', ['Text below baseline', 'Text above baseline', 'Small caps', 'Hidden text'], 'Text above baseline', 'Like a footnote number or square.')
    ],
    performanceSteps: [
      d('w1p1', 'Home', Difficulty.EASY, 'Step-by-Step: Apply Bold and Italics.', ['Highlight the text', 'Press Ctrl + B', 'Press Ctrl + I'], 'Conceptual basis: w1q1/q4.'),
      d('w1p2', 'Home', Difficulty.INTERMEDIATE, 'Step-by-Step: Copy styles with Format Painter.', ['Select the styled text', 'Click the Format Painter brush', 'Highlight the target text'], 'Conceptual basis: w1q5.'),
      d('w1p3', 'Home', Difficulty.INTERMEDIATE, 'Step-by-Step: Center and Double-space a title.', ['Click on the title line', 'Click Center Align (Ctrl+E)', 'Click Line Spacing', 'Select 2.0'], 'Conceptual basis: w1q6/q13.'),
      d('w1p4', 'Home', Difficulty.DIFFICULT, 'Step-by-Step: Reset a messy paragraph.', ['Highlight the paragraph', 'Go to Home Tab', 'Click Clear All Formatting'], 'Conceptual basis: w1q10.'),
      d('w1p5', 'Home', Difficulty.DIFFICULT, 'Step-by-Step: Set a Hanging Indent.', ['Right click paragraph', 'Select "Paragraph..."', 'Under Special, pick "Hanging"', 'Click OK'], 'Conceptual basis: w1q9.')
    ],
    tutorialContent: { 
      title: 'Home Mastery', 
      points: ['Font = Looks', 'Paragraph = Flow', 'Styles = Hierarchy'], 
      proTip: 'Alt + H is the secret shortcut to access the Home ribbon!',
      videoUrl: 'https://www.youtube.com/embed/S-nHYzK-BVg'
    }
  },
  {
    id: 'w2', title: 'Insert: Objects & Visuals', tool: 'Word', xpReward: 50, stageTitle: 'Foundations',
    description: 'Add Pictures, Tables, and Links.',
    questions: [
      q('w2q1', 'Insert', Difficulty.EASY, 'Where to add a picture?', ['Home', 'Insert', 'Layout', 'View'], 'Insert', 'Objects are in Insert.'),
      q('w2q2', 'Insert', Difficulty.EASY, 'Insert Table location?', ['Insert Tab', 'Home Tab', 'Data Tab', 'Design Tab'], 'Insert Tab', 'Grids are in Insert.'),
      q('w2q3', 'Insert', Difficulty.INTERMEDIATE, 'Hyperlink shortcut?', ['Ctrl+H', 'Ctrl+K', 'Ctrl+L', 'Ctrl+P'], 'Ctrl+K', 'Link text to websites.'),
      q('w2q4', 'Insert', Difficulty.INTERMEDIATE, 'Decorative text tool?', ['TextBox', 'WordArt', 'Equation', 'Symbol'], 'WordArt', 'Stylish graphical text.'),
      q('w2q5', 'Insert', Difficulty.DIFFICULT, 'Visual diagram tool?', ['Pictures', 'SmartArt', 'Shapes', 'Icons'], 'SmartArt', 'Turns lists into graphics.'),
      q('w2q6', 'Insert', Difficulty.EASY, 'Insert Page Break?', ['Layout Tab', 'Insert Tab', 'Home Tab', 'References Tab'], 'Insert Tab', 'Immediately starts next page.'),
      q('w2q7', 'Insert', Difficulty.INTERMEDIATE, 'Header & Footer group?', ['Home', 'Design', 'Layout', 'Insert'], 'Insert', 'Page headers.'),
      q('w2q8', 'Insert', Difficulty.DIFFICULT, 'Cross-reference connects to?', ['Bookmarks/Headings', 'External Sites', 'Printer', 'Files'], 'Bookmarks/Headings', 'Internal linking.'),
      q('w2q9', 'Insert', Difficulty.EASY, 'Add a basic square?', ['Shapes', 'Icons', 'Models', 'ClipArt'], 'Shapes', 'Geometry drawing.'),
      q('w2q10', 'Insert', Difficulty.INTERMEDIATE, 'Insert Equation tool?', ['Home', 'Insert', 'Review', 'View'], 'Insert', 'Math formulas.'),
      q('w2q11', 'Insert', Difficulty.DIFFICULT, 'Screenshot tool location?', ['Insert > Illustrations', 'Home > Font', 'Layout > Setup', 'File > Save'], 'Insert > Illustrations', 'Capture windows.'),
      q('w2q12', 'Insert', Difficulty.EASY, 'Symbol tool icon?', ['Omega (Ω)', 'Sigma (Σ)', 'Plus (+)', 'Dollar ($)'], 'Omega (Ω)', 'Special chars.'),
      q('w2q13', 'Insert', Difficulty.INTERMEDIATE, 'Insert Text Box?', ['Home', 'Insert', 'Design', 'Layout'], 'Insert', 'Floating text.'),
      q('w2q14', 'Insert', Difficulty.DIFFICULT, 'Cover Page preset location?', ['Home', 'Insert', 'Layout', 'References'], 'Insert', 'Professional covers.'),
      q('w2q15', 'Insert', Difficulty.EASY, 'Bookmark tool?', ['Review', 'Insert', 'View', 'Layout'], 'Insert', 'Named locations.')
    ],
    performanceSteps: [
      d('w2p1', 'Insert', Difficulty.EASY, 'Step-by-Step: Insert a 3x3 Table.', ['Go to Insert Tab', 'Click Table', 'Drag to select 3x3 grid', 'Click to confirm'], 'Conceptual basis: w2q2.'),
      d('w2p2', 'Insert', Difficulty.INTERMEDIATE, 'Step-by-Step: Link a word to a website.', ['Highlight a word', 'Press Ctrl + K', 'Type or paste the URL', 'Click OK'], 'Conceptual basis: w2q3.'),
      d('w2p3', 'Insert', Difficulty.DIFFICULT, 'Step-by-Step: Create a process graphic.', ['Go to Insert Tab', 'Click SmartArt', 'Select "Process"', 'Pick a style and add your text'], 'Conceptual basis: w2q5.')
    ],
    tutorialContent: { 
      title: 'Insert Objects', 
      points: ['Tables organize data', 'SmartArt visualizes ideas', 'Headers keep info consistent'], 
      proTip: 'Use Icons for modern, scalable graphics!',
      videoUrl: 'https://www.youtube.com/embed/7Vp8X_Cq5Dk'
    }
  },
  {
    id: 'w3', title: 'Layout & Design', tool: 'Word', xpReward: 50, stageTitle: 'Page Setup',
    description: 'Master Margins, Orientation, and Themes.',
    questions: [
      q('w3q1', 'Layout', Difficulty.EASY, 'Where to change Margins?', ['Home', 'Insert', 'Layout', 'View'], 'Layout', 'Margins are page setup tools.'),
      q('w3q2', 'Layout', Difficulty.EASY, 'Portrait vs Landscape tool?', ['Orientation', 'Margins', 'Size', 'Columns'], 'Orientation', 'Toggles page direction.'),
      q('w3q3', 'Layout', Difficulty.INTERMEDIATE, 'How to create 2 columns?', ['Layout > Columns', 'Home > Paragraph', 'Insert > Table', 'Design > Theme'], 'Layout > Columns', 'Splits text into vertical blocks.'),
      q('w3q4', 'Layout', Difficulty.INTERMEDIATE, 'What is a "Section Break"?', ['Ends a page', 'Allows different formatting in parts', 'Checks spelling', 'Adds a border'], 'Allows different formatting in parts', 'Crucial for multi-format docs.'),
      q('w3q5', 'Layout', Difficulty.DIFFICULT, 'Gutter margin is for?', ['Binding', 'White space', 'Footers', 'Title pages'], 'Binding', 'Extra space for staples/binding.'),
      q('w3q6', 'Design', Difficulty.EASY, 'Where is Page Border?', ['Insert', 'Design', 'Layout', 'Review'], 'Design', 'Visual styles are in Design.'),
      q('w3q7', 'Design', Difficulty.INTERMEDIATE, 'Watermark purpose?', ['Background faint text', 'Decorative border', 'Page numbers', 'Color theme'], 'Background faint text', 'Mark as Confidential or Draft.'),
      q('w3q8', 'Layout', Difficulty.EASY, 'Standard paper size?', ['A4', 'Letter', 'Legal', 'Executive'], 'Letter', 'US standard is 8.5" x 11".'),
      q('w3q9', 'References', Difficulty.INTERMEDIATE, 'Table of Contents requires?', ['Hyperlinks', 'Styles (Headings)', 'Page breaks', 'Images'], 'Styles (Headings)', 'Auto-generated from Heading 1/2.'),
      q('w3q10', 'Layout', Difficulty.DIFFICULT, 'Hyphenation tool does?', ['Splits words at line ends', 'Corrects grammar', 'Adds bullets', 'Deletes text'], 'Splits words at line ends', 'Improves text flow in narrow columns.'),
      q('w3q11', 'Layout', Difficulty.EASY, 'Indent tool location?', ['Layout > Paragraph', 'Home > Font', 'View > Show', 'Insert > Header'], 'Layout > Paragraph', 'Exact indent controls.'),
      q('w3q12', 'References', Difficulty.INTERMEDIATE, 'Footnote shortcut?', ['Alt+Ctrl+F', 'Ctrl+F', 'Alt+F', 'Shift+F'], 'Alt+Ctrl+F', 'Adds note at bottom of page.'),
      q('w3q13', 'Design', Difficulty.DIFFICULT, 'Theme vs Style?', ['Theme affects colors/fonts globally', 'Theme is only for text', 'Style is global', 'No difference'], 'Theme affects colors/fonts globally', 'Consistent look.'),
      q('w3q14', 'Layout', Difficulty.INTERMEDIATE, 'Line Numbers tool?', ['Home Tab', 'Layout Tab', 'Review Tab', 'View Tab'], 'Layout Tab', 'Used for legal documents.'),
      q('w3q15', 'Layout', Difficulty.EASY, 'Standard margin size?', ['1 inch', '0.5 inch', '2 inches', '0.1 inch'], '1 inch', 'Default "Normal" margin.')
    ],
    performanceSteps: [
      d('w3p1', 'Layout', Difficulty.EASY, 'Step-by-Step: Change to Landscape.', ['Go to Layout Tab', 'Click Orientation', 'Select Landscape'], 'Conceptual basis: w3q2.'),
      d('w3p2', 'Layout', Difficulty.INTERMEDIATE, 'Step-by-Step: Set narrow margins.', ['Go to Layout Tab', 'Click Margins', 'Select "Narrow" (0.5")'], 'Conceptual basis: w3q1/q15.'),
      d('w3p3', 'Layout', Difficulty.DIFFICULT, 'Step-by-Step: Create 2 Columns.', ['Highlight your text', 'Go to Layout Tab', 'Click Columns', 'Select "Two"'], 'Conceptual basis: w3q3.')
    ],
    tutorialContent: { 
      title: 'Page Architecture', 
      points: ['Margins define boundaries', 'Orientation fits content', 'Columns organize flow'], 
      proTip: 'Use Section Breaks to mix Portrait and Landscape in one file!',
      videoUrl: 'https://www.youtube.com/embed/S_nHYzK-BVg'
    }
  }
];

// EXCEL LESSONS
const excelLessons: Lesson[] = [
  {
    id: 'e1', title: 'Home: Cells & Calculations', tool: 'Excel', xpReward: 50, stageTitle: 'Data Entry',
    description: 'Master Formula entry and Cell basics.',
    questions: [
      q('e1q1', 'Home', Difficulty.EASY, 'Formula start symbol?', ['#', '=', '$', '+'], '=', 'Every calculation starts with =.'),
      q('e1q2', 'Home', Difficulty.EASY, 'Cell address of Row 5 Column B?', ['5B', 'B-5', 'B5', 'ColB'], 'B5', 'Letter then Number.'),
      q('e1q3', 'Home', Difficulty.EASY, 'Merge & Center does?', ['Delete cells', 'Combines cells and centers text', 'Multiplies cells', 'Splits cells'], 'Combines cells and centers text', 'Layout tool for headers.'),
      q('e1q4', 'Home', Difficulty.INTERMEDIATE, 'Currency symbol tool location?', ['Font Group', 'Number Group', 'Alignment Group', 'Styles Group'], 'Number Group', 'Handles formatting like $ and %.'),
      q('e1q5', 'Home', Difficulty.INTERMEDIATE, 'What is Conditional Formatting?', ['Manual coloring', 'Automatic coloring based on rules', 'A type of chart', 'A formula error'], 'Automatic coloring based on rules', 'Visualizes data trends.'),
      q('e1q6', 'Home', Difficulty.DIFFICULT, 'Absolute Reference symbol?', ['#', '$', '%', '&'], '$', '$A$1 locks the cell.'),
      q('e1q7', 'Home', Difficulty.DIFFICULT, 'AutoSum shortcut?', ['Alt+=', 'Ctrl+=', 'Shift+=', 'Alt+S'], 'Alt+=', 'Fast summation.'),
      q('e1q8', 'Home', Difficulty.EASY, 'Shortcut for "Format Cells"?', ['Ctrl+1', 'Ctrl+F', 'Ctrl+Shift+F', 'Ctrl+S'], 'Ctrl+1', 'Opens deep formatting settings.'),
      q('e1q9', 'Home', Difficulty.INTERMEDIATE, 'Fill Handle location?', ['Top left of cell', 'Bottom right of cell', 'Center of cell', 'Top right of cell'], 'Bottom right of cell', 'Used to drag patterns.'),
      q('e1q10', 'Home', Difficulty.DIFFICULT, 'Named Range?', ['Reference cell by word', 'A type of font', 'A protected sheet', 'An error code'], 'Reference cell by word', 'E.g. naming A1:A10 "Sales".'),
      q('e1q11', 'Home', Difficulty.EASY, 'Add a new Worksheet?', ['+ button at bottom', 'Ctrl+N', 'Alt+F4', 'File > Info'], '+ button at bottom', 'The sheet bar.'),
      q('e1q12', 'Home', Difficulty.INTERMEDIATE, 'Orientation tool (ab icon)?', ['Wraps text', 'Rotates text diagonally', 'Merges cells', 'Deletes cell'], 'Rotates text diagonally', 'Found in Alignment group.'),
      q('e1q13', 'Home', Difficulty.DIFFICULT, 'What does #REF! mean?', ['Formula is too long', 'Invalid cell reference', 'Value is zero', 'File is not saved'], 'Invalid cell reference', 'Common calculation error.'),
      q('e1q14', 'Home', Difficulty.EASY, 'Bold shortcut?', ['Ctrl+B', 'Ctrl+I', 'Ctrl+U', 'Ctrl+S'], 'Ctrl+B', 'Same as Word.'),
      q('e1q15', 'Home', Difficulty.INTERMEDIATE, 'Shortcut to Edit active cell?', ['F1', 'F2', 'F5', 'F12'], 'F2', 'Fast entry mode.')
    ],
    performanceSteps: [
      d('e1p1', 'Home', Difficulty.EASY, 'Step-by-Step: Calculate A1 + A2.', ['Click the target cell', 'Type "="', 'Select cell A1', 'Type "+"', 'Select cell A2', 'Press Enter'], 'Conceptual basis: e1q1.'),
      d('e1p2', 'Home', Difficulty.INTERMEDIATE, 'Step-by-Step: Format as Currency.', ['Highlight the data', 'Go to Home Tab', 'Open Number dropdown', 'Select "Currency"'], 'Conceptual basis: e1q4.'),
      d('e1p3', 'Home', Difficulty.DIFFICULT, 'Step-by-Step: Lock a cell reference.', ['Start a formula', 'Select a cell', 'Press F4 to add $ signs', 'Complete formula'], 'Conceptual basis: e1q6.')
    ],
    tutorialContent: { 
      title: 'Excel Foundations', 
      points: ['= starts everything', 'Number formatting = readability', 'F2 is your best friend'], 
      proTip: 'Double click a column header edge to Auto-Fit width!',
      videoUrl: 'https://www.youtube.com/embed/rwbho0CgEAE'
    }
  },
  {
    id: 'e2', title: 'Insert: Visualizing Data', tool: 'Excel', xpReward: 50, stageTitle: 'Data Entry',
    description: 'Master Charts, Tables, and Sparklines.',
    questions: [
      q('e2q1', 'Insert', Difficulty.EASY, 'Where to add a Chart?', ['Home', 'Insert', 'Data', 'View'], 'Insert', 'Visuals are in Insert.'),
      q('e2q2', 'Insert', Difficulty.EASY, 'Convert range to Table shortcut?', ['Ctrl+T', 'Ctrl+L', 'Ctrl+K', 'Ctrl+B'], 'Ctrl+T', 'T for Table.'),
      q('e2q3', 'Insert', Difficulty.INTERMEDIATE, 'What is a PivotTable?', ['A static image', 'A tool to summarize data', 'A type of border', 'A formula error'], 'A tool to summarize data', 'Advanced analytical tool.'),
      q('e2q4', 'Insert', Difficulty.INTERMEDIATE, 'Recommended Charts tool does?', ['Suggests best chart for data', 'Fixes errors', 'Adds colors', 'Deletes data'], 'Suggests best chart for data', 'Quick visualization.'),
      q('e2q5', 'Insert', Difficulty.DIFFICULT, 'Sparklines are?', ['Tiny charts in a cell', 'Large background images', 'Formatting rules', 'Type of font'], 'Tiny charts in a cell', 'Miniature data trends.'),
      q('e2q6', 'Insert', Difficulty.EASY, 'Add a Link (Hyperlink)?', ['Ctrl+K', 'Ctrl+L', 'Ctrl+P', 'Ctrl+H'], 'Ctrl+K', 'Same as Word.'),
      q('e2q7', 'Insert', Difficulty.INTERMEDIATE, 'Insert Slicer use?', ['Visual filter for Tables/Pivot', 'Cut cells', 'Delete rows', 'Copy format'], 'Visual filter for Tables/Pivot', 'Interactive filtering.'),
      q('e2q8', 'Insert', Difficulty.DIFFICULT, 'Insert Timeline is for?', ['Filtering dates visually', 'Drawing lines', 'Setting a clock', 'Animation'], 'Filtering dates visually', 'Date-specific slicer.'),
      q('e2q9', 'Insert', Difficulty.EASY, 'Insert Illustration types?', ['Pictures, Shapes, Icons', 'Numbers', 'Cells', 'Columns'], 'Pictures, Shapes, Icons', 'Visual elements.'),
      q('e2q10', 'Insert', Difficulty.INTERMEDIATE, 'What is a "Table Header Row"?', ['Label row in a table', 'Top of the file', 'Row 1 only', 'Title of sheet'], 'Label row in a table', 'Keeps labels visible.'),
      q('e2q11', 'Insert', Difficulty.DIFFICULT, 'Chart Elements (+ button)?', ['Add labels, titles, axes', 'Change color', 'Delete chart', 'Save data'], 'Add labels, titles, axes', 'Fine-tune charts.'),
      q('e2q12', 'Insert', Difficulty.EASY, 'Insert Symbol tool?', ['Omega (Ω)', 'Sigma (Σ)', 'Alpha (α)', 'Beta (β)'], 'Omega (Ω)', 'Special chars.'),
      q('e2q13', 'Insert', Difficulty.INTERMEDIATE, 'Switch Row/Column in Chart?', ['Swaps data series', 'Deletes chart', 'Rotates text', 'Multiplies data'], 'Swaps data series', 'Flip axes.'),
      q('e2q14', 'Insert', Difficulty.DIFFICULT, 'Insert 3D Maps?', ['Geo-spatial visual tool', 'Drawing 3D cubes', 'Printing maps', 'Navigation'], 'Geo-spatial visual tool', 'Visualizes location data.'),
      q('w2q15', 'Insert', Difficulty.EASY, 'TextBox location?', ['Insert Tab', 'Home Tab', 'Data Tab', 'View Tab'], 'Insert Tab', 'Floating labels.')
    ],
    performanceSteps: [
      d('e2p1', 'Insert', Difficulty.EASY, 'Step-by-Step: Create a Pie Chart.', ['Highlight your data labels/values', 'Go to Insert Tab', 'Click Pie Chart icon', 'Select 2D Pie'], 'Conceptual basis: e2q1.'),
      d('e2p2', 'Insert', Difficulty.INTERMEDIATE, 'Step-by-Step: Convert data to a Table.', ['Click anywhere in your data', 'Press Ctrl + T', 'Check "My table has headers"', 'Click OK'], 'Conceptual basis: e2q2.'),
      d('e2p3', 'Insert', Difficulty.DIFFICULT, 'Step-by-Step: Add a Column Sparkline.', ['Select the target cell', 'Go to Insert Tab', 'Click Sparklines > Column', 'Select the data range', 'Click OK'], 'Conceptual basis: e2q5.')
    ],
    tutorialContent: { 
      title: 'Data Visualization', 
      points: ['Charts tell the story', 'Tables automate logic', 'Sparklines show trends'], 
      proTip: 'Use Alt+F1 to instantly create a default chart from selected data!',
      videoUrl: 'https://www.youtube.com/embed/rwbho0CgEAE'
    }
  },
  {
    id: 'e3', title: 'Data: Organization', tool: 'Excel', xpReward: 50, stageTitle: 'Analysis',
    description: 'Master Sorting, Filtering, and Data Tools.',
    questions: [
      q('e3q1', 'Data', Difficulty.EASY, 'Sort A-Z location?', ['Home & Data Tab', 'Insert Tab', 'View Tab', 'Review Tab'], 'Home & Data Tab', 'Found in multiple places.'),
      q('e3q2', 'Data', Difficulty.EASY, 'Filter tool icon?', ['Funnel', 'Magnifying Glass', 'Grid', 'Arrow'], 'Funnel', 'Represents narrowing down.'),
      q('e3q3', 'Data', Difficulty.INTERMEDIATE, 'Flash Fill shortcut?', ['Ctrl+E', 'Ctrl+F', 'Ctrl+D', 'Ctrl+G'], 'Ctrl+E', 'Smart data extraction/filling.'),
      q('e3q4', 'Data', Difficulty.INTERMEDIATE, 'Text to Columns purpose?', ['Split one cell into many', 'Change font', 'Merge cells', 'Translate text'], 'Split one cell into many', 'Essential for CSV/imports.'),
      q('e3q5', 'Data', Difficulty.DIFFICULT, 'Data Validation prevents?', ['Invalid data entry', 'Formatting errors', 'Formula errors', 'Printing'], 'Invalid data entry', 'E.g. only allow numbers 1-10.'),
      q('e3q6', 'Data', Difficulty.DIFFICULT, 'What is "Remove Duplicates"?', ['Deletes repetitive rows', 'Clears formatting', 'Deletes all data', 'Hides rows'], 'Deletes repetitive rows', 'Cleans data sets.'),
      q('e3q7', 'Data', Difficulty.EASY, 'Data Tab "Refresh All" button?', ['Updates external connections', 'Clears cell content', 'Saves the file', 'Restarts Excel'], 'Updates external connections', 'Syncs data sources.'),
      q('e3q8', 'Data', Difficulty.INTERMEDIATE, 'Filter by Color?', ['Narrow by cell fill/font color', 'Paint cells', 'Sort by name', 'Format cells'], 'Narrow by cell fill/font color', 'Visual filtering.'),
      q('e3q9', 'Data', Difficulty.DIFFICULT, 'What-If Analysis: Goal Seek?', ['Finds input for a desired result', 'Checks for errors', 'Prints reports', 'Sorts data'], 'Finds input for a desired result', 'Reverse calculation.'),
      q('e3q10', 'Data', Difficulty.EASY, 'Clear Filters shortcut?', ['Ctrl+Shift+L (Toggle)', 'Ctrl+C', 'Alt+Del', 'F5'], 'Ctrl+Shift+L (Toggle)', 'Quickly on/off filters.'),
      q('e3q11', 'Data', Difficulty.INTERMEDIATE, 'Data Grouping?', ['Collapses/Expands rows/cols', 'Combines worksheets', 'Deletes rows', 'Formats text'], 'Collapses/Expands rows/cols', 'Manage large sheets.'),
      q('e3q12', 'Data', Difficulty.DIFFICULT, 'Consolidate tool?', ['Merges data from multiple ranges', 'Deletes empty cells', 'Adds comments', 'Protects sheet'], 'Merges data from multiple ranges', 'Aggregate data.'),
      q('e3q13', 'Data', Difficulty.EASY, 'Sort Z-A?', ['Descending order', 'Ascending order', 'Random order', 'No order'], 'Descending order', 'Largest to smallest.'),
      q('e3q14', 'Data', Difficulty.INTERMEDIATE, 'Get Data (Power Query) location?', ['Data Tab', 'Home Tab', 'Insert Tab', 'Review Tab'], 'Data Tab', 'ETL processes.'),
      q('e3q15', 'Data', Difficulty.DIFFICULT, 'Advanced Filter allows?', ['Complex criteria logic', 'Fast sorting', 'Changing themes', 'Deleting rows'], 'Complex criteria logic', 'Filter using criteria ranges.')
    ],
    performanceSteps: [
      d('e3p1', 'Data', Difficulty.EASY, 'Step-by-Step: Apply a Filter.', ['Click inside your header row', 'Go to Data Tab', 'Click Filter (Funnel)', 'Use dropdown on column to pick value'], 'Conceptual basis: e3q2.'),
      d('e3p2', 'Data', Difficulty.INTERMEDIATE, 'Step-by-Step: Extract first names (Flash Fill).', ['Type the first name in next column', 'Type second one below it', 'Press Ctrl + E', 'Verify results'], 'Conceptual basis: e3q3.'),
      d('e3p3', 'Data', Difficulty.DIFFICULT, 'Step-by-Step: Setup a Dropdown list.', ['Select target cell', 'Go to Data Tab > Data Validation', 'Allow: "List"', 'Type options: Yes,No', 'Click OK'], 'Conceptual basis: e3q5.')
    ],
    tutorialContent: { 
      title: 'Data Management', 
      points: ['Filters isolate data', 'Flash Fill is magic', 'Validation prevents mess'], 
      proTip: 'Ctrl+Shift+L toggles filters instantly on any data range!',
      videoUrl: 'https://www.youtube.com/embed/rwbho0CgEAE'
    }
  }
];

// POWERPOINT LESSONS
const pptLessons: Lesson[] = [
  {
    id: 'p1', title: 'Home: Layouts & Slides', tool: 'PowerPoint', xpReward: 50, stageTitle: 'Presentation',
    description: 'Master Slides, Layouts, and Arrangement.',
    questions: [
      q('p1q1', 'Home', Difficulty.EASY, 'New Slide shortcut?', ['Ctrl+N', 'Ctrl+M', 'Ctrl+S', 'Ctrl+A'], 'Ctrl+M', 'M for "More" slides.'),
      q('p1q2', 'Home', Difficulty.EASY, 'Reset slide button?', ['Deletes slide', 'Restores placeholders to original spots', 'Undoes text', 'Changes colors'], 'Restores placeholders to original spots', 'Fixes messy layouts.'),
      q('p1q3', 'Home', Difficulty.EASY, 'Duplicate object shortcut?', ['Ctrl+C', 'Ctrl+D', 'Ctrl+X', 'Ctrl+V'], 'Ctrl+D', 'Fast duplicate.'),
      q('p1q4', 'Home', Difficulty.INTERMEDIATE, 'What is "Arrange > Group"?', ['Sort items', 'Combines objects to move as one', 'Hide items', 'Deletes items'], 'Combines objects to move as one', 'Organization tool.'),
      q('p1q5', 'Home', Difficulty.INTERMEDIATE, 'Layout dropdown?', ['Changes slide structure', 'Changes background', 'Adds video', 'Saves deck'], 'Changes slide structure', 'Switch from Title to Content.'),
      q('p1q6', 'Home', Difficulty.DIFFICULT, 'Selection Pane use?', ['Manage object visibility and order', 'Pick fonts', 'Set timing', 'Start show'], 'Manage object visibility and order', 'Layer management.'),
      q('p1q7', 'Home', Difficulty.DIFFICULT, 'Bring to Front logic?', ['Moves object to top layer', 'Moves object to bottom', 'Deletes object', 'Centers object'], 'Moves object to top layer', 'Visibility logic.'),
      q('p1q8', 'Home', Difficulty.EASY, 'Bold shortcut?', ['Ctrl+B', 'Ctrl+I', 'Ctrl+U', 'Ctrl+S'], 'Ctrl+B', 'Universal bold.'),
      q('p1q9', 'Home', Difficulty.INTERMEDIATE, 'Character Spacing (AV icon)?', ['Changes line height', 'Changes space between letters', 'Changes font size', 'Changes case'], 'Changes space between letters', 'Tight vs Loose.'),
      q('p1q10', 'Home', Difficulty.DIFFICULT, 'What is a Section?', ['A way to group slides', 'A type of font', 'A drawing tool', 'A transition'], 'A way to group slides', 'For large presentations.'),
      q('p1q11', 'Home', Difficulty.EASY, 'Paste Special location?', ['Home Tab', 'Insert Tab', 'Design Tab', 'View Tab'], 'Home Tab', 'Clipboard options.'),
      q('p1q12', 'Home', Difficulty.INTERMEDIATE, 'Align tool purpose?', ['Equal spacing between objects', 'Rotating shapes', 'Adding colors', 'Deleting layers'], 'Equal spacing between objects', 'Pro placement.'),
      q('p1q13', 'Home', Difficulty.DIFFICULT, 'Convert to SmartArt tool?', ['Turns text into a graphic', 'Deletes text', 'Checks spelling', 'Adds video'], 'Turns text into a graphic', 'Home tab visual tool.'),
      q('p1q14', 'Home', Difficulty.EASY, 'New Slide icon location?', ['Top left of Home Tab', 'Insert Tab only', 'File menu', 'Bottom of screen'], 'Top left of Home Tab', 'Quick access.'),
      q('p1q15', 'Home', Difficulty.INTERMEDIATE, 'Text Direction tool?', ['Rotates text in boxes', 'Changes font', 'Underlines text', 'Justifies text'], 'Rotates text in boxes', 'Alignment group.')
    ],
    performanceSteps: [
      d('p1p1', 'Home', Difficulty.EASY, 'Step-by-Step: Add and Setup a slide.', ['Press Ctrl + M', 'Click Layout dropdown', 'Select "Two Content"'], 'Conceptual basis: p1q1/q5.'),
      d('p1p2', 'Home', Difficulty.INTERMEDIATE, 'Step-by-Step: Clean up slide arrangement.', ['Select multiple objects', 'Go to Arrange > Align', 'Click Align Middle', 'Click Group'], 'Conceptual basis: p1q4/q12.'),
      d('p1p3', 'Home', Difficulty.DIFFICULT, 'Step-by-Step: Manage layers.', ['Go to Arrange', 'Open Selection Pane', 'Drag the Logo to the top', 'Click eye icon to hide background'], 'Conceptual basis: p1q6/q7.')
    ],
    tutorialContent: { 
      title: 'Slide Logic', 
      points: ['Layouts = Box setup', 'Arrange = Layering', 'Ctrl+M = Speed'], 
      proTip: 'Hold Shift while resizing shapes to keep their proportions!',
      videoUrl: 'https://www.youtube.com/embed/XF34-Wu6qWU'
    }
  },
  {
    id: 'p2', title: 'Design & Transitions', tool: 'PowerPoint', xpReward: 50, stageTitle: 'Presentation',
    description: 'Master Themes, Slide Size, and Movement.',
    questions: [
      q('p2q1', 'Design', Difficulty.EASY, 'Apply a global look?', ['Themes', 'Fonts', 'Colors', 'Backgrounds'], 'Themes', 'Design Tab primary tool.'),
      q('p2q2', 'Design', Difficulty.EASY, 'Change slide to Standard (4:3)?', ['Slide Size', 'Format Background', 'Layout', 'Reset'], 'Slide Size', 'Standard vs Widescreen.'),
      q('p2q3', 'Transitions', Difficulty.INTERMEDIATE, 'What is a Transition?', ['Motion between slides', 'Motion on one slide', 'Sound effect', 'Image filter'], 'Motion between slides', 'Movement between scenes.'),
      q('p2q4', 'Transitions', Difficulty.INTERMEDIATE, 'Apply to All button does?', ['Sets transition for whole deck', 'Deletes slides', 'Saves the file', 'Starts show'], 'Sets transition for whole deck', 'Consistency tool.'),
      q('p2q5', 'Design', Difficulty.DIFFICULT, 'Designer (Design Ideas) use?', ['AI suggested layouts', 'Drawing shapes', 'Changing fonts', 'Timing show'], 'AI suggested layouts', 'Auto-designing.'),
      q('p2q6', 'Transitions', Difficulty.EASY, 'Morph transition does?', ['Animates smooth movement of objects', 'Fade out', 'Split screen', 'Zoom'], 'Animates smooth movement of objects', 'Pro-level animation.'),
      q('p2q7', 'Transitions', Difficulty.INTERMEDIATE, 'Transition Timing (Duration)?', ['How fast the animation plays', 'When the slide ends', 'Total show time', 'Delay'], 'How fast the animation plays', 'Set speed in seconds.'),
      q('p2q8', 'Design', Difficulty.DIFFICULT, 'Format Background options?', ['Fill, Gradient, Picture, Pattern', 'Only color', 'Fonts', 'Layouts'], 'Fill, Gradient, Picture, Pattern', 'Custom backdrops.'),
      q('p2q9', 'Design', Difficulty.EASY, 'Variant tool in Design tab?', ['Different colors for same theme', 'New theme', 'Slide layout', 'Header'], 'Different colors for same theme', 'Color palette swaps.'),
      q('p2q10', 'Transitions', Difficulty.INTERMEDIATE, 'Advance Slide settings?', ['On Mouse Click or After Time', 'Only Mouse', 'Only Keyboard', 'Auto-save'], 'On Mouse Click or After Time', 'Self-running shows.'),
      q('p2q11', 'Design', Difficulty.DIFFICULT, 'Slide Master view purpose?', ['Universal changes to all slides', 'Preview show', 'Edit one image', 'Check spelling'], 'Universal changes to all slides', 'Global template edit.'),
      q('p2q12', 'Transitions', Difficulty.EASY, 'Sound tool in Transitions?', ['Add audio clip to transition', 'Background music', 'Narration', 'Mute'], 'Add audio clip to transition', 'Audio feedback on change.'),
      q('p2q13', 'Design', Difficulty.INTERMEDIATE, 'Hide Background Graphics?', ['Removes theme shapes for one slide', 'Deletes theme', 'Hides all text', 'Transparent slide'], 'Removes theme shapes for one slide', 'Clean up specific slides.'),
      q('p2q14', 'Transitions', Difficulty.DIFFICULT, 'Effect Options button?', ['Change direction of transition', 'Delete transition', 'Change slide', 'Preview'], 'Change direction of transition', 'E.g. Push from Left or Right.'),
      q('p2q15', 'Design', Difficulty.EASY, 'Design Tab location?', ['Between Insert and Transitions', 'Next to Home', 'At end of ribbon', 'In File menu'], 'Between Insert and Transitions', 'Standard ribbon order.')
    ],
    performanceSteps: [
      d('p2p1', 'Design', Difficulty.EASY, 'Step-by-Step: Apply a Theme.', ['Go to Design Tab', 'Open Themes dropdown', 'Pick a style (e.g. Facet)', 'Select a Color Variant'], 'Conceptual basis: p2q1/q9.'),
      d('p2p2', 'Transitions', Difficulty.INTERMEDIATE, 'Step-by-Step: Add a Fade transition.', ['Select a slide', 'Go to Transitions Tab', 'Click "Fade"', 'Click "Apply to All"'], 'Conceptual basis: p2q3/q4.'),
      d('p2p3', 'Transitions', Difficulty.DIFFICULT, 'Step-by-Step: Use Morph magic.', ['Duplicate a slide', 'Move objects on the second slide', 'Go to Transitions', 'Select "Morph"'], 'Conceptual basis: p2q6.')
    ],
    tutorialContent: { 
      title: 'Design Aesthetics', 
      points: ['Themes = Unity', 'Transitions = Flow', 'Morph = Professionalism'], 
      proTip: 'Use "Designer" (Design Ideas) to instantly fix ugly slide layouts!',
      videoUrl: 'https://www.youtube.com/embed/XF34-Wu6qWU'
    }
  },
  {
    id: 'p3', title: 'Animations & Slideshow', tool: 'PowerPoint', xpReward: 50, stageTitle: 'Delivery',
    description: 'Master Object Motion and Presenting.',
    questions: [
      q('p3q1', 'Animations', Difficulty.EASY, 'Entrance vs Exit effect?', ['Green (In) vs Red (Out)', 'Both Green', 'Both Blue', 'Yellow'], 'Green (In) vs Red (Out)', 'Standard color coding.'),
      q('p3q2', 'Animations', Difficulty.EASY, 'Animation Pane use?', ['Manage timing and order of effects', 'Draw lines', 'Pick colors', 'Save file'], 'Manage timing and order of effects', 'Visual timeline.'),
      q('p3q3', 'Slideshow', Difficulty.INTERMEDIATE, 'Start from Beginning shortcut?', ['F5', 'Shift+F5', 'Ctrl+F5', 'F12'], 'F5', 'Start the presentation.'),
      q('p3q4', 'Slideshow', Difficulty.INTERMEDIATE, 'Start from Current Slide?', ['Shift+F5', 'F5', 'Alt+F5', 'Ctrl+F5'], 'Shift+F5', 'Resume where you are.'),
      q('p3q5', 'Animations', Difficulty.DIFFICULT, 'Trigger tool does?', ['Effect starts when clicking an object', 'Auto-save', 'Delete slide', 'Sound'], 'Effect starts when clicking an object', 'Interactive slides.'),
      q('p3q6', 'Slideshow', Difficulty.DIFFICULT, 'Presenter View benefits?', ['Notes, next slide, timer visible to you', 'Full screen for everyone', 'Edits text', 'Checks grammar'], 'Notes, next slide, timer visible to you', 'Pro delivery.'),
      q('p3q7', 'Animations', Difficulty.EASY, 'Add Animation button?', ['Layer multiple effects on one item', 'Delete effects', 'Replace effect', 'Move item'], 'Layer multiple effects on one item', 'Advanced stacking.'),
      q('p3q8', 'Animations', Difficulty.INTERMEDIATE, 'Animation Painter?', ['Copies effects to other items', 'Colors animations', 'Deletes effects', 'Draws shapes'], 'Copies effects to other items', 'Format painter for motion.'),
      q('p3q9', 'Slideshow', Difficulty.DIFFICULT, 'Custom Slideshow purpose?', ['Pick specific slides to show', 'Change themes', 'Add music', 'Print'], 'Pick specific slides to show', 'Tailored presentations.'),
      q('p3q10', 'Animations', Difficulty.EASY, 'Motion Paths?', ['Move items along lines/curves', 'Rotate items', 'Scale items', 'Hide items'], 'Move items along lines/curves', 'Custom movement.'),
      q('p3q11', 'Slideshow', Difficulty.INTERMEDIATE, 'Rehearse Timings tool?', ['Record how long each slide takes', 'Set a clock', 'Animation speed', 'Delay'], 'Record how long each slide takes', 'Practicing for auto-slides.'),
      q('p3q12', 'Animations', Difficulty.DIFFICULT, 'Start: With Previous vs After Previous?', ['Simultaneous vs Sequential', 'Same thing', 'No difference', 'Deletes effect'], 'Simultaneous vs Sequential', 'Critical for automation.'),
      q('p3q13', 'Slideshow', Difficulty.EASY, 'Hide Slide purpose?', ['Skips slide during show', 'Deletes slide', 'Moves slide to end', 'Locks slide'], 'Skips slide during show', 'Keep info available but invisible.'),
      q('p3q14', 'Animations', Difficulty.INTERMEDIATE, 'Animation Delay?', ['Wait before effect starts', 'Total effect time', 'End of show', 'Start time'], 'Wait before effect starts', 'Staggered entrances.'),
      q('p3q15', 'Slideshow', Difficulty.EASY, 'Laser Pointer tool (Ctrl+L)?', ['Digital pointer during show', 'Draws on slide', 'Deletes text', 'Zooms in'], 'Digital pointer during show', 'Visual aid.')
    ],
    performanceSteps: [
      d('p3p1', 'Animations', Difficulty.EASY, 'Step-by-Step: Add an Entrance effect.', ['Select an image or text', 'Go to Animations Tab', 'Pick a green Entrance effect', 'Preview'], 'Conceptual basis: p3q1.'),
      d('p3p2', 'Animations', Difficulty.INTERMEDIATE, 'Step-by-Step: Layer two effects.', ['Select an object', 'Apply a Fly In effect', 'Click "Add Animation"', 'Select an Emphasis effect'], 'Conceptual basis: p3q7.'),
      d('p3p3', 'Slideshow', Difficulty.DIFFICULT, 'Step-by-Step: Start from a specific slide.', ['Navigate to Slide 5', 'Hold Shift', 'Press F5', 'Enter Presenter View'], 'Conceptual basis: p3q4/q6.')
    ],
    tutorialContent: { 
      title: 'Dynamic Delivery', 
      points: ['Motion focuses attention', 'Presenter view is a cheat sheet', 'F5 for speed'], 
      proTip: 'Press "B" while presenting to instantly turn the screen Black and focus the audience on YOU!',
      videoUrl: 'https://www.youtube.com/embed/XF34-Wu6qWU'
    }
  }
];

export const INITIAL_LESSONS: Lesson[] = [...wordLessons, ...excelLessons, ...pptLessons];

export const NAV_ITEMS = [
  { id: 'learn', label: 'Learn', icon: <LayoutDashboard className="w-6 h-6" /> },
  { id: 'tutorials', label: 'Tutorials', icon: <BookOpen className="w-6 h-6" /> },
  { id: 'profile', label: 'Profile', icon: <User className="w-6 h-6" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-6 h-6" /> },
];

export const GUIDEBOOK_DATA = {
  Word: [
    { 
      ribbon: 'Home', 
      icon: <Type size={16}/>, 
      description: 'The primary tab for font styling, paragraph flow, and simple copy/paste logic.', 
      tools: ['Font (Bold, Size, Color)', 'Paragraph (Align, Spacing)', 'Format Painter', 'Styles (Headings)', 'Find/Replace (Ctrl+F/H)'],
      drills: ['Applying Styles: Select text > Home > Bold/Color', 'Using Redo: Ctrl+Y', 'Clearing styles: Eraser icon', 'Hanging Indent: Paragraph Settings']
    },
    { 
      ribbon: 'Insert', 
      icon: <ImageIcon size={16}/>, 
      description: 'Used to add any object into your document like tables, headers, or shapes.', 
      tools: ['Tables (Grids)', 'Pictures (This Device)', 'Header & Footer', 'SmartArt (Diagrams)', 'Page Break (Start new page)'],
      drills: ['Table Creation: Insert > Table > Drag grid', 'Hyperlinking: Ctrl+K', 'SmartArt: Insert > Pick type']
    },
    { 
      ribbon: 'Layout', 
      icon: <Columns size={16}/>, 
      description: 'Controls the physical architecture of the page, including margins, breaks, and sizing.', 
      tools: ['Margins (Normal/Narrow)', 'Orientation (Portrait/Landscape)', 'Columns (1, 2, 3)', 'Section Breaks (Next Page)', 'Hyphenation'],
      drills: ['Changing Orientation: Layout > Orientation', 'Section Breaks: Layout > Breaks', 'Standard Margin: 1 inch']
    }
  ],
  Excel: [
    { 
      ribbon: 'Home', 
      icon: <Calculator size={16}/>, 
      description: 'Number formatting, cell alignment, and basic table calculations.', 
      tools: ['Formula Entry (=)', 'Merge & Center', 'Currency Format ($)', 'Conditional Formatting', 'AutoSum (Alt+=)'],
      drills: ['Basic Math: Starts with =', 'Locking cells: $ sign (F4)', 'Summing: Alt + =', 'Formatting: Number dropdown']
    },
    { 
      ribbon: 'Insert', 
      icon: <BarChart size={16}/>, 
      description: 'Visualize data using charts, pivot tables, and miniature sparklines.', 
      tools: ['Charts (Pie, Column, Line)', 'PivotTables (Analysis)', 'Tables (Ctrl+T)', 'Sparklines (In-cell charts)', 'Slicers (Interactive filters)'],
      drills: ['Create Chart: Insert > Chart', 'Table Conversion: Ctrl+T', 'PivotTable: Insert > PivotTable']
    },
    { 
      ribbon: 'Data', 
      icon: <Database size={16}/>, 
      description: 'Advanced data organization tools for sorting, filtering, and cleaning records.', 
      tools: ['Sort (A-Z/Z-A)', 'Filter (Funnel)', 'Flash Fill (Ctrl+E)', 'Text to Columns', 'Data Validation'],
      drills: ['Applying Filter: Data > Filter', 'Flash Fill: Ctrl+E', 'Cleaning: Remove Duplicates']
    }
  ],
  PowerPoint: [
    { 
      ribbon: 'Home', 
      icon: <Layout size={16}/>, 
      description: 'Slide management, box layouts, and object layering.', 
      tools: ['New Slide (Ctrl+M)', 'Layout Presets', 'Arrange (Layering)', 'Selection Pane (Object list)', 'Group (Move as one)'],
      drills: ['New Slides: Ctrl+M', 'Duplicating: Ctrl+D', 'Alignment: Arrange > Align > Center', 'Resetting: Reset button']
    },
    { 
      ribbon: 'Transitions', 
      icon: <PlaySquare size={16}/>, 
      description: 'Movement between slides. Crucial for professional deck pacing.', 
      tools: ['Morph (Smart Move)', 'Fade', 'Push', 'Apply to All', 'Duration (Timing)'],
      drills: ['Add Transition: Transitions > Pick effect', 'Smooth Motion: Use Morph', 'Global Effect: Apply to All']
    },
    { 
      ribbon: 'Animations', 
      icon: <Sparkles size={16}/>, 
      description: 'Movement on a single slide for specific images or text blocks.', 
      tools: ['Entrance (Green)', 'Exit (Red)', 'Animation Pane', 'Trigger', 'Add Animation (Layering)'],
      drills: ['Entrance: Green effect', 'Exit: Red effect', 'Pane: Animation Pane > Order']
    }
  ]
};
