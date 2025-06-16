export default function generateHTML(formData) {
    if (!Array.isArray(formData)) return '<form></form>';
    let html = '<form>';
    formData.forEach(field => {
        html += `<label>${field.label}</label>`;
        html += `<input type="${field.type}" name="${field.name}" />`;
    });
    html += '</form>';
    return html;
}
