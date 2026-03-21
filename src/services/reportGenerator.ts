import { Transaction, FinancialMetrics } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

/**
 * Generate comprehensive PDF report using jsPDF and html2canvas
 * Install: npm install jspdf html2canvas
 */

interface ScoreMetrics {
  paymentHistoryScore: number;
  delinquencyScore: number;
  incomeStabilityScore: number;
  utilizationScore: number;
  emiComplianceScore: number;
  spendingPatternScore: number;
}

export async function generateCreditReport(
  creditScore: number,
  riskLevel: string,
  metrics: FinancialMetrics,
  transactions: Transaction[],
  scoreMetrics: ScoreMetrics
): Promise<void> {
  try {
    // Dynamic import to avoid build issues
    const jsPDF = (await import('jspdf')).jsPDF;
    const html2canvas = (await import('html2canvas')).default;

    // Create HTML content for the report
    const htmlContent = generateReportHTML(creditScore, riskLevel, metrics, transactions, scoreMetrics);

    // Create temporary container
    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '1200px';
    document.body.appendChild(container);

    // Convert HTML to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: '#ffffff'
    });

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    // Download
    pdf.save('credit-report.pdf');

    // Cleanup
    document.body.removeChild(container);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please install jspdf and html2canvas: npm install jspdf html2canvas');
  }
}

export async function generateMonthlyReport(
  metrics: FinancialMetrics,
  transactions: Transaction[]
): Promise<void> {
  try {
    const jsPDF = (await import('jspdf')).jsPDF;
    const html2canvas = (await import('html2canvas')).default;

    const htmlContent = generateMonthlyReportHTML(metrics, transactions);

    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '1200px';
    document.body.appendChild(container);

    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: '#ffffff'
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save('monthly-report.pdf');

    document.body.removeChild(container);
  } catch (error) {
    console.error('Error generating monthly report:', error);
  }
}

export async function generateTransactionHistory(transactions: Transaction[]): Promise<void> {
  try {
    const jsPDF = (await import('jspdf')).jsPDF;
    const html2canvas = (await import('html2canvas')).default;

    const htmlContent = generateTransactionHistoryHTML(transactions);

    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '1200px';
    document.body.appendChild(container);

    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: '#ffffff'
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save('transaction-history.pdf');

    document.body.removeChild(container);
  } catch (error) {
    console.error('Error generating transaction history:', error);
  }
}

function generateReportHTML(
  creditScore: number,
  riskLevel: string,
  metrics: FinancialMetrics,
  _transactions: Transaction[],
  scoreMetrics: ScoreMetrics
): string {
  const today = new Date().toLocaleDateString('en-IN');
  
  return `
    <div style="font-family: Arial, sans-serif; padding: 40px; line-height: 1.6;">
      <h1 style="text-align: center; color: #1f2937; margin-bottom: 10px;">Credit Analysis Report</h1>
      <p style="text-align: center; color: #6b7280; margin-bottom: 30px;">Generated on ${today}</p>

      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="color: #1f2937; margin-top: 0;">Your Credit Score</h2>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 48px; font-weight: bold; color: #10b981;">${creditScore}</div>
            <div style="color: #6b7280; font-size: 14px;">out of 850</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 24px; font-weight: bold; color: ${riskLevel === 'Low Risk' ? '#10b981' : riskLevel === 'Medium Risk' ? '#f59e0b' : '#ef4444'};">
              ${riskLevel}
            </div>
            <div style="color: #6b7280; font-size: 14px;">Risk Category</div>
          </div>
        </div>
      </div>

      <h2 style="color: #1f2937; margin-bottom: 15px;">Score Components</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <tr style="background: #f3f4f6;">
          <th style="padding: 12px; text-align: left; color: #1f2937; font-weight: bold;">Component</th>
          <th style="padding: 12px; text-align: right; color: #1f2937; font-weight: bold;">Score</th>
          <th style="padding: 12px; text-align: left; color: #1f2937; font-weight: bold;">Weight</th>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px;">Payment History</td>
          <td style="padding: 12px; text-align: right;">${Math.round(scoreMetrics.paymentHistoryScore)}</td>
          <td style="padding: 12px;">20%</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px;">Delinquency</td>
          <td style="padding: 12px; text-align: right;">${Math.round(scoreMetrics.delinquencyScore)}</td>
          <td style="padding: 12px;">25%</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px;">Income Stability</td>
          <td style="padding: 12px; text-align: right;">${Math.round(scoreMetrics.incomeStabilityScore)}</td>
          <td style="padding: 12px;">15%</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px;">Utilization</td>
          <td style="padding: 12px; text-align: right;">${Math.round(scoreMetrics.utilizationScore)}</td>
          <td style="padding: 12px;">15%</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px;">EMI Compliance</td>
          <td style="padding: 12px; text-align: right;">${Math.round(scoreMetrics.emiComplianceScore)}</td>
          <td style="padding: 12px;">15%</td>
        </tr>
        <tr>
          <td style="padding: 12px;">Spending Patterns</td>
          <td style="padding: 12px; text-align: right;">${Math.round(scoreMetrics.spendingPatternScore)}</td>
          <td style="padding: 12px;">10%</td>
        </tr>
      </table>

      <h2 style="color: #1f2937; margin-bottom: 15px;">Financial Metrics</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <tr style="background: #f3f4f6;">
          <th style="padding: 12px; text-align: left; color: #1f2937; font-weight: bold;">Metric</th>
          <th style="padding: 12px; text-align: right; color: #1f2937; font-weight: bold;">Value</th>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px;">Average Monthly Income</td>
          <td style="padding: 12px; text-align: right; font-weight: bold;">${formatCurrency(metrics.averageIncome)}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px;">Average Monthly Expenses</td>
          <td style="padding: 12px; text-align: right; font-weight: bold;">${formatCurrency(metrics.averageExpenses)}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px;">Savings Rate</td>
          <td style="padding: 12px; text-align: right; font-weight: bold;">${metrics.savingsRate.toFixed(1)}%</td>
        </tr>
        <tr>
          <td style="padding: 12px;">Repayment History</td>
          <td style="padding: 12px; text-align: right; font-weight: bold;">${metrics.repaymentHistory.toFixed(1)}%</td>
        </tr>
      </table>

      <div style="background: #f0f9ff; padding: 20px; border-left: 4px solid #0284c7; border-radius: 4px; margin-top: 30px;">
        <h3 style="color: #0c4a6e; margin-top: 0;">Recommendations</h3>
        <ul style="color: #0c4a6e; margin-bottom: 0;">
          ${creditScore >= 750 ? '<li>Excellent credit score! Continue maintaining your payment discipline.</li>' : ''}
          ${metrics.savingsRate < 15 ? '<li>Try to increase your savings rate. Aim for at least 15-20% of your income.</li>' : ''}
          ${metrics.repaymentHistory < 90 ? '<li>Focus on improving your EMI payment consistency.</li>' : ''}
          <li>Regular monitoring of your financial health will help maintain a strong credit profile.</li>
        </ul>
      </div>
    </div>
  `;
}

function generateMonthlyReportHTML(metrics: FinancialMetrics, transactions: Transaction[]): string {
  const currentMonth = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  return `
    <div style="font-family: Arial, sans-serif; padding: 40px; line-height: 1.6;">
      <h1 style="text-align: center; color: #1f2937; margin-bottom: 10px;">Monthly Financial Summary</h1>
      <p style="text-align: center; color: #6b7280; margin-bottom: 30px;">${currentMonth}</p>

      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="color: #1f2937; margin-top: 0;">Key Metrics</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <div style="color: #6b7280; font-size: 14px;">Average Monthly Income</div>
            <div style="font-size: 24px; font-weight: bold; color: #10b981;">${formatCurrency(metrics.averageIncome)}</div>
          </div>
          <div>
            <div style="color: #6b7280; font-size: 14px;">Average Monthly Expenses</div>
            <div style="font-size: 24px; font-weight: bold; color: #ef4444;">${formatCurrency(metrics.averageExpenses)}</div>
          </div>
          <div>
            <div style="color: #6b7280; font-size: 14px;">Savings Rate</div>
            <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">${metrics.savingsRate.toFixed(1)}%</div>
          </div>
          <div>
            <div style="color: #6b7280; font-size: 14px;">Repayment History</div>
            <div style="font-size: 24px; font-weight: bold; color: #f59e0b;">${metrics.repaymentHistory.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      <h2 style="color: #1f2937; margin-bottom: 15px;">Category Breakdown</h2>
      <p style="color: #6b7280; margin-bottom: 15px;">Spending analysis across all transaction categories</p>
      <p style="color: #6b7280; font-size: 12px;">Total transactions analyzed: ${transactions.length}</p>
    </div>
  `;
}

function generateTransactionHistoryHTML(transactions: Transaction[]): string {
  const today = new Date().toLocaleDateString('en-IN');

  return `
    <div style="font-family: Arial, sans-serif; padding: 40px; line-height: 1.6;">
      <h1 style="text-align: center; color: #1f2937; margin-bottom: 10px;">Transaction History Report</h1>
      <p style="text-align: center; color: #6b7280; margin-bottom: 30px;">Generated on ${today}</p>

      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <div style="display: flex; justify-content: space-between;">
          <div>
            <div style="color: #6b7280; font-size: 14px;">Total Transactions</div>
            <div style="font-size: 24px; font-weight: bold; color: #1f2937;">${transactions.length}</div>
          </div>
          <div>
            <div style="color: #6b7280; font-size: 14px;">Total Income</div>
            <div style="font-size: 24px; font-weight: bold; color: #10b981;">
              ${formatCurrency(transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0))}
            </div>
          </div>
          <div>
            <div style="color: #6b7280; font-size: 14px;">Total Expenses</div>
            <div style="font-size: 24px; font-weight: bold; color: #ef4444;">
              ${formatCurrency(transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0))}
            </div>
          </div>
        </div>
      </div>

      <h2 style="color: #1f2937; margin-bottom: 15px;">Recent Transactions (Last 20)</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background: #f3f4f6;">
          <th style="padding: 12px; text-align: left; color: #1f2937; font-weight: bold;">Date</th>
          <th style="padding: 12px; text-align: left; color: #1f2937; font-weight: bold;">Description</th>
          <th style="padding: 12px; text-align: left; color: #1f2937; font-weight: bold;">Category</th>
          <th style="padding: 12px; text-align: right; color: #1f2937; font-weight: bold;">Amount</th>
          <th style="padding: 12px; text-align: center; color: #1f2937; font-weight: bold;">Type</th>
        </tr>
        ${transactions
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 20)
          .map(
            (t, idx) => `
          <tr style="border-bottom: 1px solid #e5e7eb; ${idx % 2 === 0 ? 'background: #f9fafb;' : ''}">
            <td style="padding: 12px;">${formatDate(t.date)}</td>
            <td style="padding: 12px;">${t.description}</td>
            <td style="padding: 12px;">${t.category}</td>
            <td style="padding: 12px; text-align: right; font-weight: bold; color: ${t.type === 'credit' ? '#10b981' : '#ef4444'};">
              ${t.type === 'credit' ? '+' : '-'}${formatCurrency(t.amount)}
            </td>
            <td style="padding: 12px; text-align: center;">
              <span style="background: ${t.type === 'credit' ? '#d1fae5' : '#fee2e2'}; color: ${t.type === 'credit' ? '#065f46' : '#7f1d1d'}; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">
                ${t.type === 'credit' ? 'Income' : 'Expense'}
              </span>
            </td>
          </tr>
        `
          )
          .join('')}
      </table>
    </div>
  `;
}
