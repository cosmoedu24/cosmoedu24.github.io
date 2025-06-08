/**
 * Google Sheets API 클라이언트 라이브러리
 * 서버 없이 클라이언트에서 직접 Google Sheets 데이터를 가져옵니다.
 */

class GoogleSheetsAPI {
    constructor() {
        this.isInitialized = false;
        this.gapi = null;
    }

    /**
     * Google API 초기화
     */
    async init() {
        try {
            // gapi가 로드될 때까지 대기
            await this.waitForGapi();
            
            console.log('Google API 초기화 중...');
            
            // Google API 초기화
            await gapi.load('client', async () => {
                await gapi.client.init({
                    apiKey: window.CONFIG.GOOGLE_API.KEY,
                    discoveryDocs: window.CONFIG.GOOGLE_API.DISCOVERY_DOCS
                });
                
                this.isInitialized = true;
                console.log('Google Sheets API 초기화 완료');
            });
            
        } catch (error) {
            console.error('Google API 초기화 실패:', error);
            throw error;
        }
    }

    /**
     * gapi 로드 대기
     */
    waitForGapi() {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 50;
            
            const checkGapi = () => {
                attempts++;
                if (typeof gapi !== 'undefined') {
                    resolve();
                } else if (attempts >= maxAttempts) {
                    reject(new Error('Google API 로드 타임아웃'));
                } else {
                    setTimeout(checkGapi, 100);
                }
            };
            
            checkGapi();
        });
    }

    /**
     * 시트 데이터 가져오기
     * @param {string} range - 시트 범위 (예: 'computer!A2:F100')
     * @returns {Promise<Array>} 시트 데이터 배열
     */
    async getSheetData(range) {
        try {
            if (!this.isInitialized) {
                await this.init();
            }

            console.log(`시트 데이터 요청: ${range}`);
            
            const response = await gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: window.CONFIG.GOOGLE_API.SPREADSHEET_ID,
                range: range
            });

            const data = response.result.values || [];
            console.log(`${range}에서 ${data.length}개 행 가져옴`);
            
            return data;
        } catch (error) {
            console.error(`시트 데이터 로드 오류 (${range}):`, error);
            
            // 구체적인 오류 메시지 제공
            let errorMessage = '시트 데이터를 불러오는 중 오류가 발생했습니다.';
            
            if (error.status === 404) {
                errorMessage = `시트 범위를 찾을 수 없습니다: ${range}`;
            } else if (error.status === 403) {
                errorMessage = 'API 키 권한 문제. 스프레드시트 접근 권한을 확인해주세요.';
            } else if (error.status === 400) {
                errorMessage = '잘못된 요청입니다. 스프레드시트 ID나 범위를 확인해주세요.';
            }
            
            throw new Error(errorMessage);
        }
    }

    /**
     * 컴퓨터 기초활용 데이터 가져오기
     */
    async getComputerData() {
        return await this.getSheetData(window.CONFIG.SHEET_RANGES.computer);
    }
}

// 전역 인스턴스 생성
window.googleSheetsAPI = new GoogleSheetsAPI();
