myHtmlSettings = {
  nameSpace:       "html", // Useful to prevent multi-instances CSS conflict
  onShiftEnter:    {keepDefault:false, replaceWith:'<br />\n'},
  onCtrlEnter:     {keepDefault:false, openWith:'\n<p>', closeWith:'</p>\n'},
  onTab:           {keepDefault:false, openWith:'     '},
  markupSet:  [
    {name:'Heading 1', key:'1', openWith:'<h1(!( class="[![Class]!]")!)>', closeWith:'</h1>', placeHolder:'Your title here...' },
    {name:'Heading 2', key:'2', openWith:'<h2(!( class="[![Class]!]")!)>', closeWith:'</h2>', placeHolder:'Your title here...' },
    {name:'Heading 3', key:'3', openWith:'<h3(!( class="[![Class]!]")!)>', closeWith:'</h3>', placeHolder:'Your title here...' },
    {name:'Paragraph', openWith:'<p(!( class="[![Class]!]")!)>', closeWith:'</p>'  },
    {separator:'---------------' },
    {name:'Bold', key:'B', openWith:'<strong>', closeWith:'</strong>' },
    {name:'Italic', key:'I', openWith:'<em>', closeWith:'</em>'  },
    {name:'Stroke through', key:'S', openWith:'<del>', closeWith:'</del>' },
    {separator:'---------------' },
    {name:'Ul', openWith:'<ul>\n', closeWith:'</ul>\n' },
    {name:'Ol', openWith:'<ol>\n', closeWith:'</ol>\n' },
    {name:'Li', openWith:'<li>', closeWith:'</li>' },
    {separator:'---------------' },
    {name:'Picture', key:'P', replaceWith:'<img src="[![Source:!:http://]!]" alt="[![Alternative text]!]" />' },
    {name:'Link', key:'L', openWith:'<a href="[![Link:!:http://]!]"(!( title="[![Title]!]")!)>', closeWith:'</a>', placeHolder:'Your text to link...' },
    {separator:'---------------' },
    {name:'Preview', call:'preview', className:'preview' }
  ],
  previewInWindow: 'width=800, height=600, resizable=yes, scrollbars=yes',
  previewAutoRefresh: true,
  previewParser: function(content) {
    return content;
  }
};