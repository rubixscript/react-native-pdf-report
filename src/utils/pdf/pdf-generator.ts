/**
 * @pdf-generator
 * @description Utility functions for generating PDF reports
 */

import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { DataItem, ActivitySession, ReportOptions } from '../../types';

/**
 * Generate HTML content for the PDF report
 */
export const generatePDFHTML = (
  options: ReportOptions,
  data: DataItem[],
  sessions: ActivitySession[],
  itemName: string = 'Item',
  itemNamePlural: string = 'Items',
  sessionLabel: string = 'Sessions'
): string => {
  const reportTitle = options.customTitle || `${options.type} Report`;
  const generatedDate = new Date().toLocaleDateString();

  // Filter data based on selected options
  const filteredData = options.itemId
    ? data.filter(item => item.id === options.itemId)
    : data;

  const completedItems = filteredData.filter(item => {
    // Assuming items have a currentPage/totalPages or similar progress indicator
    const itemAny = item as any;
    return itemAny.currentPage === itemAny.totalPages;
  });
  const totalProgress = filteredData.reduce((sum, item) => {
    const itemAny = item as any;
    return sum + (itemAny.currentPage || 0);
  }, 0);
  const totalDuration = sessions.reduce((sum, session) => sum + (session.duration || 0), 0);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${reportTitle}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          padding: 40px;
          color: #333;
          line-height: 1.6;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid #007AFF;
        }
        .header h1 {
          color: #007AFF;
          font-size: 32px;
          margin-bottom: 10px;
        }
        .header p {
          color: #666;
          font-size: 14px;
        }
        .summary {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }
        .summary-item {
          text-align: center;
        }
        .summary-item .label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .summary-item .value {
          font-size: 28px;
          font-weight: bold;
          color: #007AFF;
          margin-top: 5px;
        }
        .section {
          margin-bottom: 30px;
        }
        .section h2 {
          color: #333;
          font-size: 20px;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e0e0e0;
        }
        .item-card {
          background: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 15px;
        }
        .item-card:last-child { margin-bottom: 0; }
        .item-title {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin-bottom: 5px;
        }
        .item-subtitle {
          color: #666;
          font-size: 14px;
          margin-bottom: 10px;
        }
        .item-meta {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          font-size: 13px;
          color: #666;
        }
        .item-meta span {
          background: #f0f0f0;
          padding: 5px 12px;
          border-radius: 15px;
        }
        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          margin-top: 10px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #007AFF, #00C7BE);
          border-radius: 4px;
        }
        .session-item {
          padding: 15px;
          border-left: 3px solid #007AFF;
          background: #f8f9fa;
          margin-bottom: 10px;
          border-radius: 0 8px 8px 0;
        }
        .session-date {
          font-weight: 600;
          color: #333;
          margin-bottom: 5px;
        }
        .session-details {
          font-size: 13px;
          color: #666;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
          text-align: center;
          color: #999;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${reportTitle}</h1>
        <p>Generated on ${generatedDate}</p>
      </div>

      ${options.includeItemDetails ? `
      <div class="summary">
        <div class="summary-item">
          <div class="label">Total ${itemNamePlural}</div>
          <div class="value">${filteredData.length}</div>
        </div>
        <div class="summary-item">
          <div class="label">Completed</div>
          <div class="value">${completedItems.length}</div>
        </div>
        <div class="summary-item">
          <div class="label">Progress</div>
          <div class="value">${totalProgress}</div>
        </div>
        <div class="summary-item">
          <div class="label">Time</div>
          <div class="value">${Math.round(totalDuration)}m</div>
        </div>
      </div>
      ` : ''}

      ${options.includeItemDetails ? `
      <div class="section">
        <h2>${itemNamePlural} Overview</h2>
        ${filteredData.map(item => {
          const itemAny = item as any;
          const progress = itemAny.totalPages
            ? Math.round((itemAny.currentPage / itemAny.totalPages) * 100)
            : 0;
          return `
            <div class="item-card">
              <div class="item-title">${itemAny.title || item.name || item.id}</div>
              ${itemAny.author ? `<div class="item-subtitle">by ${itemAny.author}</div>` : ''}
              ${itemAny.category ? `<div class="item-meta"><span>${itemAny.category}</span></div>` : ''}
              ${itemAny.totalPages ? `
                <div class="item-meta">
                  <span>${itemAny.currentPage}/${itemAny.totalPages}</span>
                  <span>${progress}% complete</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
      ` : ''}

      ${options.includeSessionDetails ? `
      <div class="section">
        <h2>Recent ${sessionLabel}</h2>
        ${sessions.slice(0, 10).map(session => {
          const relatedItem = data.find(d => d.id === session.itemId);
          const itemAny = relatedItem as any;
          return `
            <div class="session-item">
              <div class="session-date">${session.date || 'No date'}</div>
              <div class="session-details">
                <strong>${itemAny?.title || itemAny?.name || 'Unknown'}</strong> •
                ${session.duration ? `${session.duration} minutes` : ''}
                ${session.notes ? `• "${session.notes}"` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
      ` : ''}

      ${options.includeAchievements ? `
      <div class="section">
        <h2>Achievements</h2>
        <div class="item-card">
          <div class="item-title">📚 Consistent Tracker</div>
          <div class="item-subtitle">Completed ${completedItems.length} ${itemName.toLowerCase()}${completedItems.length !== 1 ? 's' : ''}!</div>
        </div>
        ${totalProgress > 100 ? `
          <div class="item-card">
            <div class="item-title">📖 High Achiever</div>
            <div class="item-subtitle">Recorded ${totalProgress} total progress units!</div>
          </div>
        ` : ''}
        ${totalDuration > 120 ? `
          <div class="item-card">
            <div class="item-title">⏰ Dedicated</div>
            <div class="item-subtitle">Spent over ${Math.round(totalDuration / 60)} hours!</div>
          </div>
        ` : ''}
      </div>
      ` : ''}

      <div class="footer">
        <p>Generated by PDF Report Library • ${generatedDate}</p>
      </div>
    </body>
    </html>
  `;
};

/**
 * Generate and save PDF report to device
 */
export const downloadPDFReport = async (
  options: ReportOptions,
  data: DataItem[],
  sessions: ActivitySession[],
  itemName?: string,
  itemNamePlural?: string,
  sessionLabel?: string
): Promise<string> => {
  const html = generatePDFHTML(options, data, sessions, itemName, itemNamePlural, sessionLabel);
  const { uri } = await Print.printToFileAsync({ html });

  // Create a permanent file in documents directory using the legacy API
  const fileName = `Report_${Date.now()}.pdf`;
  const fileUri = FileSystem.documentDirectory + fileName;

  await FileSystem.copyAsync({ from: uri, to: fileUri });

  return fileUri;
};

/**
 * Generate and share PDF report
 */
export const sharePDFReport = async (
  options: ReportOptions,
  data: DataItem[],
  sessions: ActivitySession[],
  itemName?: string,
  itemNamePlural?: string,
  sessionLabel?: string
): Promise<void> => {
  const html = generatePDFHTML(options, data, sessions, itemName, itemNamePlural, sessionLabel);
  const { uri } = await Print.printToFileAsync({ html });

  await Sharing.shareAsync(uri, {
    mimeType: 'application/pdf',
    dialogTitle: 'Share Report',
  });
};
