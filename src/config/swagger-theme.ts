export const customSwaggerCSS = `
  /* Main Container */
  .swagger-ui {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  /* Top Bar - Hide default topbar */
  .swagger-ui .topbar {
    display: none;
  }

  /* Custom Header */
  .swagger-ui .info {
    margin: 30px 0;
  }

  .swagger-ui .info .title {
    font-size: 42px;
    font-weight: 700;
    color: #2e7d32;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .swagger-ui .info .title:before {
    content: "🌱";
    font-size: 48px;
  }

  .swagger-ui .info .description {
    font-size: 16px;
    line-height: 1.8;
    color: #424242;
    max-width: 900px;
    background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
    padding: 25px;
    border-radius: 12px;
    border-left: 5px solid #4caf50;
    margin-bottom: 20px;
  }

  /* Authorization Button */
  .swagger-ui .auth-wrapper .authorize {
    margin-right: 20px;
  }

  .swagger-ui .btn.authorize {
    background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px 25px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
    transition: all 0.3s ease;
  }

  .swagger-ui .btn.authorize:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
  }

  .swagger-ui .btn.authorize svg {
    fill: white;
  }

  /* Operation Blocks */
  .swagger-ui .opblock {
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
  }

  .swagger-ui .opblock:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }

  /* POST Method - Green */
  .swagger-ui .opblock.opblock-post {
    border-color: #4caf50;
    background: rgba(76, 175, 80, 0.03);
  }

  .swagger-ui .opblock.opblock-post .opblock-summary-method {
    background: #4caf50;
    font-weight: 700;
  }

  .swagger-ui .opblock.opblock-post .tab-header .tab-item.active h4 span:after {
    background: #4caf50;
  }

  /* GET Method - Blue */
  .swagger-ui .opblock.opblock-get {
    border-color: #2196f3;
    background: rgba(33, 150, 243, 0.03);
  }

  .swagger-ui .opblock.opblock-get .opblock-summary-method {
    background: #2196f3;
    font-weight: 700;
  }

  .swagger-ui .opblock.opblock-get .tab-header .tab-item.active h4 span:after {
    background: #2196f3;
  }

  /* PUT Method - Orange */
  .swagger-ui .opblock.opblock-put {
    border-color: #ff9800;
    background: rgba(255, 152, 0, 0.03);
  }

  .swagger-ui .opblock.opblock-put .opblock-summary-method {
    background: #ff9800;
    font-weight: 700;
  }

  /* DELETE Method - Red */
  .swagger-ui .opblock.opblock-delete {
    border-color: #f44336;
    background: rgba(244, 67, 54, 0.03);
  }

  .swagger-ui .opblock.opblock-delete .opblock-summary-method {
    background: #f44336;
    font-weight: 700;
  }

  /* Method Labels */
  .swagger-ui .opblock-summary-method {
    border-radius: 8px;
    padding: 8px 15px;
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  /* Operation Summary */
  .swagger-ui .opblock-summary-path {
    font-size: 16px;
    font-weight: 600;
    color: #212121;
  }

  .swagger-ui .opblock-summary-description {
    font-size: 14px;
    color: #666;
    font-weight: 500;
  }

  /* Execute Button */
  .swagger-ui .btn.execute {
    background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px 30px;
    font-weight: 600;
    font-size: 16px;
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
    transition: all 0.3s ease;
  }

  .swagger-ui .btn.execute:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
  }

  /* Response Section */
  .swagger-ui .responses-wrapper {
    padding: 25px;
    background: #fafafa;
    border-radius: 12px;
    margin-top: 20px;
  }

  .swagger-ui .response {
    border-radius: 8px;
    overflow: hidden;
  }

  .swagger-ui .response .response-col_status {
    font-weight: 700;
    font-size: 16px;
  }

  /* Code Blocks */
  .swagger-ui .highlight-code {
    border-radius: 8px;
  }

  .swagger-ui .highlight-code pre {
    border-radius: 8px;
    padding: 20px;
  }

  /* Request/Response Tabs */
  .swagger-ui .tab {
    border-radius: 8px 8px 0 0;
  }

  .swagger-ui .tab li {
    font-weight: 600;
  }

  .swagger-ui .tab li.active {
    background: white;
  }

  /* Parameter Table */
  .swagger-ui table thead tr th {
    background: #4caf50;
    color: white;
    font-weight: 700;
    padding: 15px;
    text-transform: uppercase;
    font-size: 13px;
    letter-spacing: 0.5px;
  }

  .swagger-ui table tbody tr td {
    padding: 15px;
    border-bottom: 1px solid #e0e0e0;
  }

  /* Models Section */
  .swagger-ui section.models {
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    padding: 20px;
    background: #fafafa;
  }

  .swagger-ui section.models h4 {
    color: #2e7d32;
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 20px;
  }

  .swagger-ui .model-box {
    border-radius: 8px;
    background: white;
    border: 1px solid #e0e0e0;
  }

  /* Schema Container */
  .swagger-ui .model {
    border-radius: 8px;
  }

  /* Try it out button */
  .swagger-ui .try-out__btn {
    background: #2196f3;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 8px 20px;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .swagger-ui .try-out__btn:hover {
    background: #1976d2;
    transform: translateY(-1px);
  }

  /* Cancel button */
  .swagger-ui .btn-clear {
    background: #f44336;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 8px 20px;
    font-weight: 600;
  }

  .swagger-ui .btn-clear:hover {
    background: #d32f2f;
  }

  /* Input Fields */
  .swagger-ui input[type=text],
  .swagger-ui input[type=email],
  .swagger-ui input[type=password],
  .swagger-ui textarea {
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    padding: 12px;
    font-size: 14px;
    transition: all 0.3s ease;
  }

  .swagger-ui input[type=text]:focus,
  .swagger-ui input[type=email]:focus,
  .swagger-ui input[type=password]:focus,
  .swagger-ui textarea:focus {
    border-color: #4caf50;
    outline: none;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
  }

  /* Select Dropdown */
  .swagger-ui select {
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    padding: 10px;
    font-size: 14px;
  }

  /* Loading Animation */
  .swagger-ui .loading-container {
    padding: 40px;
  }

  /* Footer Info */
  .swagger-ui .information-container {
    margin-top: 40px;
    padding: 25px;
    background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
    border-radius: 12px;
    border-left: 5px solid #4caf50;
  }

  /* Scrollbar */
  .swagger-ui ::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }

  .swagger-ui ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  .swagger-ui ::-webkit-scrollbar-thumb {
    background: #4caf50;
    border-radius: 10px;
  }

  .swagger-ui ::-webkit-scrollbar-thumb:hover {
    background: #2e7d32;
  }
`;

export const customSwaggerHTML = `
  <div style="
    background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
    color: white;
    padding: 30px 40px;
    margin: -20px -20px 30px -20px;
    border-radius: 0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  ">
    <div style="max-width: 1200px; margin: 0 auto;">
      <h1 style="
        font-size: 42px;
        font-weight: 700;
        margin: 0 0 15px 0;
        display: flex;
        align-items: center;
        gap: 15px;
      ">
        🌱 Solidify API Documentation
      </h1>
      <p style="
        font-size: 18px;
        margin: 0 0 20px 0;
        opacity: 0.95;
        line-height: 1.6;
      ">
        SME Carbon Management Platform - Comprehensive API for carbon tracking, collaboration, and sustainability
      </p>
      <div style="
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
        margin-top: 25px;
      ">
        <div style="
          background: rgba(255, 255, 255, 0.2);
          padding: 15px 25px;
          border-radius: 8px;
          backdrop-filter: blur(10px);
        ">
          <div style="font-size: 13px; opacity: 0.9; margin-bottom: 5px;">Version</div>
          <div style="font-size: 20px; font-weight: 700;">1.0.0</div>
        </div>
        <div style="
          background: rgba(255, 255, 255, 0.2);
          padding: 15px 25px;
          border-radius: 8px;
          backdrop-filter: blur(10px);
        ">
          <div style="font-size: 13px; opacity: 0.9; margin-bottom: 5px;">Environment</div>
          <div style="font-size: 20px; font-weight: 700;">Development</div>
        </div>
        <div style="
          background: rgba(255, 255, 255, 0.2);
          padding: 15px 25px;
          border-radius: 8px;
          backdrop-filter: blur(10px);
        ">
          <div style="font-size: 13px; opacity: 0.9; margin-bottom: 5px;">Base URL</div>
          <div style="font-size: 16px; font-weight: 600;">/api/v1</div>
        </div>
      </div>
    </div>
  </div>
`;
