/**
 * Page Objects Model
 * Provides reusable page interaction methods
 */

class BasePage {
    constructor(page) {
        this.page = page;
    }

    async navigate(url) {
        await this.page.goto(url);
        await this.page.waitForLoadState('networkidle');
    }

    async screenshot(name) {
        const timestamp = Date.now();
        return await this.page.screenshot({
            path: `tests/screenshots/${name}-${timestamp}.png`,
            fullPage: true
        });
    }

    async waitForSelector(selector, options = {}) {
        return await this.page.waitForSelector(selector, options);
    }
}

class HomePage extends BasePage {
    // Selectors
    selectors = {
        loginBtn: '#loginBtn',
        uploadZone: '#uploadZone',
        fileInput: '#fileInput',
        feedbackBtn: '#feedbackBtn',
        header: 'header.header',
        footer: 'footer',
        userProfile: '#userProfile',
        logoutBtn: '#logoutBtn'
    };

    async clickLogin() {
        await this.page.click(this.selectors.loginBtn);
    }

    async clickFeedback() {
        await this.page.click(this.selectors.feedbackBtn);
    }

    async uploadFile(filePath) {
        await this.page.setInputFiles(this.selectors.fileInput, filePath);
    }

    async isLoggedIn() {
        const profile = await this.page.$(this.selectors.userProfile);
        if (!profile) return false;
        const display = await profile.evaluate(el => window.getComputedStyle(el).display);
        return display !== 'none';
    }

    async getStatsValues() {
        return {
            totalWords: await this.page.textContent('#totalWords'),
            uniqueWords: await this.page.textContent('#uniqueWords'),
            savedCount: await this.page.textContent('#savedCount')
        };
    }
}

class LoginModal extends BasePage {
    selectors = {
        modal: '#loginModal',
        closeBtn: '#closeLoginBtn',
        emailInput: '#emailInput',
        sendOtpBtn: '#sendOtpBtn',
        otpInput: '#otpInput',
        verifyOtpBtn: '#verifyOtpBtn',
        backBtn: '#backToEmailBtn',
        step1: '#loginStep1',
        step2: '#loginStep2'
    };

    async isVisible() {
        const modal = await this.page.$(this.selectors.modal);
        if (!modal) return false;
        const display = await modal.evaluate(el => window.getComputedStyle(el).display);
        return display !== 'none';
    }

    async enterEmail(email) {
        await this.page.fill(this.selectors.emailInput, email);
    }

    async clickSendOtp() {
        await this.page.click(this.selectors.sendOtpBtn);
    }

    async enterOtp(otp) {
        await this.page.fill(this.selectors.otpInput, otp);
    }

    async clickVerifyOtp() {
        await this.page.click(this.selectors.verifyOtpBtn);
    }

    async close() {
        await this.page.click(this.selectors.closeBtn);
    }

    async getCurrentStep() {
        const step1Visible = await this.page.isVisible(this.selectors.step1);
        return step1Visible ? 1 : 2;
    }
}

class FeedbackModal extends BasePage {
    selectors = {
        modal: '#feedbackModal',
        closeBtn: '#closeFeedbackBtn',
        typeSelect: '#fbType',
        contentTextarea: '#fbContent',
        mediaInput: '#fbMedia',
        emailInput: '#fbEmail',
        submitBtn: '#submitFeedbackBtn'
    };

    async isVisible() {
        const modal = await this.page.$(this.selectors.modal);
        if (!modal) return false;
        const display = await modal.evaluate(el => window.getComputedStyle(el).display);
        return display !== 'none';
    }

    async selectType(type) {
        await this.page.selectOption(this.selectors.typeSelect, type);
    }

    async enterContent(content) {
        await this.page.fill(this.selectors.contentTextarea, content);
    }

    async enterEmail(email) {
        await this.page.fill(this.selectors.emailInput, email);
    }

    async attachFiles(filePaths) {
        // filePaths can be string or array
        await this.page.setInputFiles(this.selectors.mediaInput, filePaths);
    }

    async submit() {
        await this.page.click(this.selectors.submitBtn);
    }

    async submitFeedback(data) {
        await this.selectType(data.type);
        await this.enterContent(data.content);
        if (data.email) await this.enterEmail(data.email);
        if (data.files) await this.attachFiles(data.files);
        await this.submit();
    }

    async hasMultipleFileSupport() {
        const input = await this.page.$(this.selectors.mediaInput);
        return await input.evaluate(el => el.hasAttribute('multiple'));
    }
}

class ResultsPage extends BasePage {
    selectors = {
        resultsSection: '#resultsSection',
        wordCloud: '#wordCloud',
        dataTable: '.data-table',
        tableBody: '#tableBody',
        searchBox: '#searchBox',
        exportBtn: '#exportBtn',
        fileSelector: '#fileSelector',
        newAnalysisBtn: '#newAnalysisBtn'
    };

    async isVisible() {
        const section = await this.page.$(this.selectors.resultsSection);
        if (!section) return false;
        const display = await section.evaluate(el => window.getComputedStyle(el).display);
        return display !== 'none';
    }

    async getWordCloudWords() {
        return await this.page.$$eval('#wordCloud text', elements =>
            elements.map(el => el.textContent)
        );
    }

    async getTableRows() {
        return await this.page.$$eval(`${this.selectors.tableBody} tr`, rows =>
            rows.map(row => ({
                rank: row.cells[0]?.textContent,
                word: row.cells[1]?.textContent,
                count: row.cells[2]?.textContent,
                percentage: row.cells[3]?.textContent
            }))
        );
    }

    async searchWord(word) {
        await this.page.fill(this.selectors.searchBox, word);
    }

    async clickExport() {
        await this.page.click(this.selectors.exportBtn);
    }

    async clickNewAnalysis() {
        await this.page.click(this.selectors.newAnalysisBtn);
    }

    async getTableHeaderColor() {
        return await this.page.$eval('.data-table thead', el =>
            window.getComputedStyle(el).backgroundColor
        );
    }
}

class Toast extends BasePage {
    selectors = {
        toast: '#errorToast',
        icon: '.toast-icon',
        message: '.toast-message'
    };

    async isVisible() {
        const toast = await this.page.$(this.selectors.toast);
        if (!toast) return false;
        const display = await toast.evaluate(el => window.getComputedStyle(el).display);
        return display !== 'none' && display !== '';
    }

    async getMessage() {
        return await this.page.textContent(this.selectors.message);
    }

    async getIcon() {
        return await this.page.textContent(this.selectors.icon);
    }

    async getType() {
        const toast = await this.page.$(this.selectors.toast);
        const classes = await toast.evaluate(el => el.className);
        if (classes.includes('success-toast')) return 'success';
        if (classes.includes('error-toast')) return 'error';
        return 'unknown';
    }

    async waitForToast(timeout = 6000) {
        await this.page.waitForSelector(this.selectors.toast, {
            state: 'visible',
            timeout
        });
    }
}

module.exports = {
    HomePage,
    LoginModal,
    FeedbackModal,
    ResultsPage,
    Toast
};
