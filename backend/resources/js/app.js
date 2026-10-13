import './bootstrap';
import Alpine from 'alpinejs';
import persist from '@alpinejs/persist';
import ApexCharts from 'apexcharts';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

Alpine.plugin(persist);

window.Alpine = Alpine;
window.ApexCharts = ApexCharts;
window.Quill = Quill;

Alpine.data('wysiwyg', (config = {}) => ({
    content: config.value || '',
    quill: null,
    init() {
        const isCompact = !!config.compact;
        const placeholder = config.placeholder || 'Write description...';
        const minHeight = config.height || (isCompact ? '120px' : '220px');

        const toolbarOptions = isCompact ? [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link'],
            ['clean']
        ] : [
            [{ 'header': [2, 3, 4, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['blockquote', 'code-block'],
            ['link'],
            ['clean']
        ];

        this.quill = new Quill(this.$refs.editorContainer, {
            theme: 'snow',
            placeholder: placeholder,
            modules: {
                toolbar: toolbarOptions
            }
        });

        const editorArea = this.$refs.editorContainer.querySelector('.ql-editor');
        if (editorArea) {
            editorArea.style.minHeight = minHeight;
        }

        if (this.content && this.content.trim() !== '') {
            this.quill.root.innerHTML = this.content;
        }

        this.quill.on('text-change', () => {
            const html = this.quill.root.innerHTML;
            const plain = this.quill.getText().trim();
            const isEmpty = (plain.length === 0 && !html.includes('<img') && !html.includes('<iframe'));
            this.content = isEmpty ? '' : html;

            if (this.$refs.hiddenInput) {
                this.$refs.hiddenInput.value = this.content;
                this.$refs.hiddenInput.dispatchEvent(new Event('input', { bubbles: true }));
                this.$refs.hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    }
}));

Alpine.start();

