
export interface QuestionData {
  question: string;
  answer: string;
  options: string[];
}

const RAW_CSV = `Event Level,Category,Question,Answer A,Answer B,Answer C,Answer D,Correct
High School,Accounting,"What is the accounting equation?","Assets = Liabilities - Equity","Assets = Liabilities + Equity","Liabilities = Assets + Equity","Equity = Assets + Liabilities",B
High School,Accounting,"Which financial statement shows a company's financial position at a specific point in time?","Income Statement","Statement of Cash Flows","Balance Sheet","Retained Earnings Statement",C
High School,Accounting,"Recording a transaction in the wrong account is called a(n):","Error of Omission","Error of Commission","Error of Principle","Compensating Error",B
High School,Business Law,"Double taxation is a major disadvantage of which business structure?","Sole Proprietorship","Partnership","C-Corporation","S-Corporation",C
High School,Business Law,"A contract that is legally binding and enforceable is called:","Void","Voidable","Valid","Unenforceable",C
High School,Business Law,"The person who makes an offer to enter into a contract is the:","Offeree","Offeror","Acceptor","Promisor",B
High School,Economics,"In a market economy, what primarily determines the price of a good?","The Government","International Trade Agreements","Supply and Demand","The Producer's Cost",C
High School,Economics,"What happens to demand when the price of a complement good increases?","Demand increases","Demand decreases","Demand stays the same","Supply increases",B
High School,Economics,"Which of the following is a characteristic of a monopoly?","Many small firms","Differentiated products","One single seller","Ease of entry and exit",C
High School,Personal Finance,"What is the 'rule of 72' used to calculate?","The time it takes to double an investment","The amount of tax owed on a capital gain","The credit score required for a prime loan","The percentage of income to save for retirement",A
High School,Personal Finance,"A 'FICO score' ranges between what values?","0-100","300-850","500-1500","1-10",B
High School,Business Ethics,"A set of rules that a business follows to ensure it is acting responsibly is called:","A Profit Statement","A Code of Conduct","A Marketing Plan","A Liability Waiver",B
High School,Business Ethics,"What is 'whistleblowing'?","Blowing a whistle at a sporting event","Reporting illegal or unethical behavior within an organization","A marketing strategy to create hype","Firing an employee for no reason",B
High School,Cybersecurity,"Which of the following is the most secure password practice?","Using the same password for all accounts","Changing passwords every day","Using a unique, complex passphrase with multi-factor authentication","Storing passwords in a text file on the desktop",C
High School,Cybersecurity,"What is a 'Zero-Day' vulnerability?","A bug that has been patched for 0 days","A security flaw unknown to the vendor that is exploited before a patch exists","A virus that only works on Sundays","A firewall that blocks all traffic",B
High School,Business Management,"What is the primary function of a manager?","To do all the work themselves","To plan, organize, lead, and control","To focus only on profits","To fire employees",B
High School,Marketing,"The 'Four Ps' of marketing are Product, Price, Place, and:","Positioning","Promotion","Profit","People",B
Middle School,Digital Citizenship,"What is a 'Digital Footprint'?","The weight of your laptop","The trail of data you create while using the internet","The physical size of a computer mouse","A biometric security feature",B
Middle School,Financial Literacy,"A plan for managing your money is called a:","Receipt","Budget","Checkbook","Statement",B
Middle School,Financial Literacy,"Money you set aside for future use is called:","Expenses","Income","Savings","Debt",C
Middle School,Financial Literacy,"If you spend more than you earn, you have a:","Surplus","Balance","Deficit","Profit",C`;

export const getQuestionsForEvent = (eventName: string, division: string, limit: number = 5): QuestionData[] => {
  const lines = RAW_CSV.split('\n');
  const questions: QuestionData[] = [];
  
  const normalizedEvent = eventName.toLowerCase()
    .replace('introduction to ', '')
    .replace('intro to ', '')
    .trim();
    
  const normalizedDivision = division.toLowerCase();

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    const cleanParts = parts.map(p => p.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));

    if (cleanParts.length < 8) continue;

    const rowLevel = cleanParts[0].toLowerCase();
    const rowCategory = cleanParts[1].toLowerCase();
    
    const isLevelMatch = normalizedDivision.includes(rowLevel) || rowLevel.includes(normalizedDivision);
    const isCategoryMatch = normalizedEvent.includes(rowCategory) || rowCategory.includes(normalizedEvent);

    if (isLevelMatch && isCategoryMatch) {
      const question = cleanParts[2];
      const options = [cleanParts[3], cleanParts[4], cleanParts[5], cleanParts[6]];
      const correctLetter = cleanParts[7].toUpperCase();

      let answerText = "";
      switch (correctLetter) {
        case 'A': answerText = options[0]; break;
        case 'B': answerText = options[1]; break;
        case 'C': answerText = options[2]; break;
        case 'D': answerText = options[3]; break;
        default: answerText = "Error";
      }

      questions.push({
        question,
        answer: answerText,
        options
      });
    }
  }

  // Shuffle
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }

  return questions.slice(0, limit);
};
