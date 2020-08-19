
const puppeteer = require ('puppeteer');
const WINNER = "Graydle";

async function scrapeSite(url, winner) {
    // Init 
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    // Choose class
    const [rightClass] = await page.$x('/html/body/main/article/section/form/div[1]/div/div/div/fieldset/div/div[2]/div/label/span[2]')
    const [leftClass] = await page.$x('/html/body/main/article/section/form/div[1]/div/div/div/fieldset/div/div[1]/div/label/span[2]');
    const rightName = await rightClass.getProperty('textContent');
    const rightNameValue = await rightName.jsonValue();

    rightNameValue.replace(/\s/g, '') === winner ? await rightClass.click() : await leftClass.click();

    await page.screenshot({path: 'screenshot1.png'});
    const [nextButton1] = await page.$x('/html/body/main/article/section/form/div[2]/button');
    await nextButton1.click();
    await delay(1000);

    // answer questions
    const[question] = await page.$x('/html/body/main/article/section/form/div[1]/div/div/div/fieldset/legend/h4/span[3]');
    const questionJson = await question.getProperty('textContent');
    const questionText = await questionJson.jsonValue();

    const index = QUESTIONS.indexOf(questionText);
    const solutions = ANSWERS[index];

    const possibilities = await page.$$('.checkbox-button-label-text.question-body-font-theme.user-generated');
    const checkboxes = await page.$$('.checkbox-button-display');
    let counter = 0;

    for(posibility in possibilities) {
        let x = await possibilities[counter].getProperty('textContent');
        let xBetter = (await x.jsonValue()).replace(/\s/g, '');
        if(solutions.includes(xBetter)) {
            await checkboxes[counter].click();
        }
        counter++;
    }
    await page.screenshot({path: 'screenshot2.png', fullPage: true});

    const [nextButton2] = await page.$x('/html/body/main/article/section/form/div[2]/button[2]');
    await nextButton2.click();
    await delay(1000);

    //Submit

    const [doneButton] = await page.$x('/html/body/main/article/section/form/div[1]/div/div/div/fieldset/div/div/div/div/label');
    await doneButton.click();    
    const [submitButton] = await page.$x('/html/body/main/article/section/form/div[2]/button[2]');
    await page.screenshot({path: 'screenshot3.png'});
    await submitButton.click();

    await delay(2000);
    await page.screenshot({path: 'screenshot4.png'});
    
    // End
    browser.close();
}

const delay = ms => new Promise(res => setTimeout(res, ms));

const ANSWERS = [
    ["DarkMagician"],
    ["Ring", "Puzzle"],
];

const QUESTIONS = [
    "Which of the following is Yugi’s signature ace monster?", 
    "Which of the following are Millennium Items?"
];

scrapeSite("https://www.research.net/r/YTKM7YG", WINNER);
