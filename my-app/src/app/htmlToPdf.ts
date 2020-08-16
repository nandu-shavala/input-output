import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as moment from 'moment';
import html2pdf from 'html2pdf.js';

export class HtmlToPdf {
  public captureScreen(imageName, title, cb: Function) {
    let fileName = `${imageName}_${moment().unix()}`
    const element = document.getElementById('contentToConvert');
    var tmp_element = element.cloneNode(true);
    var header = document.createElement("H3");
    header.style.padding = "5px";
    var textnode = document.createTextNode(title);
    header.appendChild(textnode);
    // tmp_element.insertBefore(header, tmp_element.childNodes[0]);

    const opt = {
      filename: fileName,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        scale: 2,
        letterRendering: true,
        useCORS: true,
        // allowTaint: true
      },
      jsPDF: { unit: 'mm', format: 'a3', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    // New Promise-based usage:
    const worker = html2pdf().from(element).set(opt).save().thenExternal(function () {
      cb()
    })

  }


  // public captureScreen(imageName) {
  //   var data = document.getElementById('contentToConvert');
  //   html2canvas(data, { scale: 2, scrollY: -window.scrollY }).then(canvas => {
  //     // Few necessary setting options
  //     var imgWidth = 208;
  //     var pageHeight = 295;
  //     var imgHeight = canvas.height * imgWidth / canvas.width;
  //     var heightLeft = imgHeight;

  //     const contentDataURL = canvas.toDataURL('image/png')
  //     let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
  //     var position = 0;
  //     pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
  //     pdf.save(`${imageName}_${moment().unix()}.pdf`); // Generated PDF
  //   });
  // }
}
