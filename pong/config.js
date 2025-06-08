// Google Sheets API 설정
const CONFIG = {
    GOOGLE_API: {
        KEY: 'YOUR_GOOGLE_API_KEY', // 실제 API 키로 교체 필요
        DISCOVERY_DOCS: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID', // 실제 스프레드시트 ID로 교체 필요
        SCOPES: 'https://www.googleapis.com/auth/spreadsheets.readonly'
    },
    
    // 시트별 범위 설정
    SHEET_RANGES: {
        computer: 'computer!A2:F100', // 컴퓨터 기초활용 데이터
        // 필요에 따라 다른 시트 범위도 추가 가능
    }
};

// 전역으로 설정 노출
window.CONFIG = CONFIG;
