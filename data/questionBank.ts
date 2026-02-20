
export interface QuestionData {
  question: string;
  answer: string;
  options: string[];
}

const RAW_CSV = `Event Level,Category,Question,Answer A,Answer B,Answer C,Answer D,Correct
High School,Accounting,"Which financial statement reports a company’s assets liabilities and equity?","Statement of Cash Flows","Balance Sheet","Trial Balance","Income Statement",B
High School,Accounting,"Assets are best defined as what a business?","Invests","Earns","Owes","Owns",D
High School,Accounting,"Which accounting equation is correct?","Assets = Liabilities + Equity","Assets = Equity – Liabilities","Assets = Revenue + Expenses","Assets = Liabilities – Equity",A
High School,Accounting,"Revenue is recorded when it is earned under which accounting basis?","Accrual basis","Modified cash basis","Cash basis","Tax basis",A
High School,Accounting,"A journal entry must always include at least one debit and one?","Revenue","Credit","Asset","Expense",B
High School,Accounting,"Which account type increases with a debit?","Liability","Equity","Asset","Revenue",C
High School,Accounting,"Which statement shows revenues and expenses over a period of time?","Statement of Owner’s Equity","Income Statement","Balance Sheet","Trial Balance",B
High School,Accounting,"Accounts payable is classified as what type of account?","Liability","Revenue","Asset","Expense",A
High School,Accounting,"Depreciation allocates the cost of a fixed asset over its?","Market value","Useful life","Selling price","Salvage value",B
High School,Accounting,"Which of the following is a current asset?","Accounts Receivable","Building","Land","Equipment",A
High School,Accounting,"The accounting cycle begins with what step?","Recording transactions","Trial balance","Financial statements","Posting",A
High School,Accounting,"Which document provides evidence of a transaction?","Ledger","Financial statement","Source document","Audit report",C
High School,Accounting,"Expenses normally increase with which entry?","Closing entry","Debit","Credit","Adjustment",B
High School,Accounting,"The trial balance is used to verify what?","Debit and credit equality","Inventory value","Cash flow","Profitability",A
High School,Accounting,"Inventory is classified as what?","Fixed asset","Current asset","Equity","Long-term liability",B
High School,Accounting,"Net income equals revenues minus what?","Equity","Assets","Liabilities","Expenses",D
High School,Accounting,"Which account is increased by a credit?","Expense","Drawing","Asset","Revenue",D
High School,Accounting,"Prepaid insurance is what type of account?","Expense","Revenue","Liability","Asset",D
High School,Accounting,"Which financial statement shows cash inflows and outflows?","Owner’s Equity Statement","Statement of Cash Flows","Income Statement","Balance Sheet",B
High School,Accounting,"Unearned revenue is classified as?","Asset","Liability","Revenue","Expense",B
High School,Accounting,"Which inventory method assumes earliest goods purchased are sold first?","LIFO","FIFO","Specific Identification","Weighted Average",B
High School,Accounting,"What is the purpose of adjusting entries?","Record owner investments","Reverse transactions","Close accounts","Update account balances",D
High School,Accounting,"Accrued expenses represent?","Expenses incurred but unpaid","Assets purchased on credit","Revenue received in advance","Expenses paid in advance",A
High School,Accounting,"The matching principle requires expenses to be recorded?","When incurred with related revenue","At year-end","When paid","When billed",A
High School,Accounting,"Which ratio measures short-term liquidity?","Gross margin","Return on assets","Current ratio","Debt ratio",C
High School,Accounting,"Straight-line depreciation results in what expense pattern?","Decreasing","Variable","Increasing","Constant",D
High School,Accounting,"Which account appears on a post-closing trial balance?","Retained Earnings","Dividends","Expense","Revenue",A
High School,Accounting,"Cost of goods sold appears on which statement?","Income Statement","Trial Balance","Balance Sheet","Cash Flow Statement",A
High School,Accounting,"A contra asset account typically has what balance?","Temporary","Credit","Debit","Zero",B
High School,Accounting,"The allowance for doubtful accounts is used to estimate?","Future inventory losses","Uncollectible receivables","Depreciation","Revenue growth",B
High School,Accounting,"Under GAAP revenue recognition requires satisfaction of what?","Written contract","Customer payment","Invoice issuance","Performance obligation",D
High School,Accounting,"Which method results in highest net income during inflation?","FIFO","Specific Identification","Weighted Average","LIFO",A
High School,Accounting,"Comprehensive income includes net income plus?","Owner investments","Unrealized gains and losses","Dividends paid","Operating expenses",B
High School,Accounting,"Which ratio measures profitability relative to assets?","Debt ratio","Inventory turnover","Current ratio","Return on assets",D
High School,Accounting,"Deferred tax liabilities arise from?","Temporary differences","Revenue misstatements","Permanent differences","Inventory errors",A
High School,Accounting,"Impairment occurs when carrying value exceeds?","Salvage value","Fair value","Accumulated depreciation","Book value",B
High School,Accounting,"Which statement links net income to equity?","Statement of Retained Earnings","Balance Sheet","Cash Flow Statement","Trial Balance",A
High School,Accounting,"Operating activities on cash flow statement include?","Equipment purchases","Customer receipts","Loan issuance","Dividend payments",B
High School,Accounting,"Which costing method assigns overhead based on activities?","Process","Job order","Standard costing","Activity-based costing",D
High School,Accounting,"Inventory turnover ratio measures?","Profitability","Efficiency","Solvency","Liquidity",B
High School,Accounting,"Which principle assumes business will continue operating?","Consistency","Going concern","Conservatism","Materiality",B
High School,Accounting,"Capitalizing an expenditure means?","Recording as asset","Recording as liability","Recording as expense","Recording as revenue",A
High School,Accounting,"Which account reduces gross accounts receivable?","Notes payable","Allowance for doubtful accounts","Bad debt expense","Sales revenue",B
High School,Accounting,"Weighted average cost divides total cost by?","Ending inventory","Units sold","Units available for sale","Units purchased",C
High School,Accounting,"Contribution margin equals sales minus?","Variable costs","Fixed costs","Total assets","Operating income",A
High School,Accounting,"Internal controls help prevent?","Profit increases","Revenue growth","Inventory turnover","Asset misuse",D
High School,Accounting,"Quick ratio excludes which item?","Marketable securities","Accounts receivable","Inventory","Cash",C
High School,Accounting,"Which account closes to retained earnings?","Assets","Liabilities","Dividends","Equipment",C
High School,Accounting,"Accrual accounting recognizes revenue when?","Customer deposits","Cash received","Invoice mailed","Performance satisfied",D
High School,Accounting,"Debt-to-equity ratio measures?","Solvency","Efficiency","Profit margin","Liquidity",A
High School,Advanced Accounting,"Which business structure issues shares of stock?","Nonprofit organization","Partnership","Corporation","Sole proprietorship",C
High School,Advanced Accounting,"Retained earnings represent?","Cumulative net income minus dividends","Market value of stock","Total assets minus liabilities","Cash held by company",A
High School,Advanced Accounting,"Which financial statement reports changes in equity?","Income Statement","Statement of Cash Flows","Statement of Retained Earnings","Balance Sheet",C
High School,Advanced Accounting,"Par value of stock represents?","Market price","Dividend amount","Book value","Legal capital per share",D
High School,Advanced Accounting,"Common stockholders typically have which right?","Fixed interest payments","Guaranteed dividends","Voting rights","Priority in liquidation over creditors",C
High School,Advanced Accounting,"Preferred stockholders usually receive?","Voting control","Management authority","Fixed dividends","Residual profits only",C
High School,Advanced Accounting,"Treasury stock is?","Authorized but unissued stock","Shares repurchased by the company","Outstanding shares","Convertible bonds",B
High School,Advanced Accounting,"A bond issued at a discount means?","Market rate exceeds coupon rate","Bond sold above face value","No interest payments","Coupon rate exceeds market rate",A
High School,Advanced Accounting,"Bonds payable are classified as?","Long-term liability","Revenue","Current asset","Equity",A
High School,Advanced Accounting,"Dividends declared become what until paid?","Revenue","Expense","Asset","Liability",D
High School,Advanced Accounting,"Goodwill arises when purchase price exceeds?","Fair value of net identifiable assets","Total assets","Net income","Book value of liabilities",A
High School,Advanced Accounting,"Earnings per share is calculated as net income divided by?","Authorized shares","Total liabilities","Total assets","Outstanding shares",D
High School,Advanced Accounting,"A partnership allocates profits based on?","Partnership agreement","Number of employees","Corporate tax rates","Equal division only",A
High School,Advanced Accounting,"Convertible bonds can be exchanged for?","Cash","Inventory","Preferred dividends","Common stock",D
High School,Advanced Accounting,"Amortization of bond discount increases?","Dividends","Interest expense","Equity","Revenue",B
High School,Advanced Accounting,"Which account increases when a corporation issues stock above par?","Treasury stock","Additional paid-in capital","Retained earnings","Dividends payable",B
High School,Advanced Accounting,"Stock splits primarily affect?","Number of shares outstanding","Net income","Total equity","Cash flows",A
High School,Advanced Accounting,"Accumulated other comprehensive income appears in?","Income statement","Liabilities","Equity section","Assets",C
High School,Advanced Accounting,"Which ratio measures ability to pay interest?","Current ratio","Inventory turnover","Debt-to-equity ratio","Times interest earned",D
High School,Advanced Accounting,"Managerial accounting focuses on?","Tax filing","External reporting","Internal decision-making","SEC compliance",C
High School,Advanced Accounting,"Under the equity method an investor recognizes income when?","Investee reports earnings","Investment sold","Stock price rises","Dividends received",A
High School,Advanced Accounting,"Consolidated financial statements combine parent and?","Subsidiary","Suppliers","Creditors","Customers",A
High School,Advanced Accounting,"Minority interest represents?","Corporate liabilities","Dividends declared","Parent ownership","Non-controlling ownership",D
High School,Advanced Accounting,"Process costing is most appropriate for?","Consulting firms","Custom jobs","Service companies","Mass production of identical units",D
High School,Advanced Accounting,"Contribution margin ratio equals contribution margin divided by?","Net income","Sales","Fixed costs","Total assets",B
High School,Advanced Accounting,"Lease classified as finance lease transfers?","No asset recognition","Only maintenance expense","Ownership-like risks and rewards","Short-term risk only",C
High School,Advanced Accounting,"Diluted EPS accounts for?","Convertible securities only","Treasury stock only","Potentially dilutive securities","Stock splits only",C
High School,Advanced Accounting,"Absorption costing includes?","Only fixed costs","Both fixed and variable manufacturing costs","Selling expenses","Only variable costs",B
High School,Advanced Accounting,"Segment reporting helps evaluate?","Tax liability","Stock dividends","Performance of business units","Inventory errors",C
High School,Advanced Accounting,"Return on equity measures?","Asset efficiency","Profitability relative to equity","Solvency","Liquidity",B
High School,Advanced Accounting,"Purchase price allocation requires assets be recorded at?","Fair value","Historical cost","Replacement cost","Tax value",A
High School,Advanced Accounting,"Intercompany transactions must be?","Recorded twice","Capitalized","Eliminated in consolidation","Reported separately",C
High School,Advanced Accounting,"Deferred revenue is recognized when?","Cash received","Invoice issued","Contract signed","Performance obligation satisfied",D
High School,Advanced Accounting,"Which costing method assigns overhead using multiple cost drivers?","Process costing","Standard costing","Job order costing","Activity-based costing",D
High School,Advanced Accounting,"Leverage increases risk because?","It raises dividends","It eliminates taxes","It reduces equity","It increases fixed obligations",D
High School,Advanced Accounting,"Goodwill impairment is tested at least?","Quarterly","Every five years","Monthly","Annually",D
High School,Advanced Accounting,"Residual income equals operating income minus?","Cost of capital charge","Taxes","Depreciation","Interest expense",A
High School,Advanced Accounting,"When bonds are issued at premium interest expense is?","Equal to coupon","Zero","Lower than coupon","Higher than coupon",C
High School,Advanced Accounting,"Comprehensive income excludes?","Dividends declared","Foreign currency translation adjustments","Net income","Unrealized gains on securities",A
High School,Advanced Accounting,"Variable costing differs from absorption costing because fixed overhead is?","Deferred indefinitely","Capitalized","Ignored","Expensed in period incurred",D
High School,Advanced Accounting,"Which ratio evaluates capital structure?","Current ratio","Gross margin","Inventory turnover","Debt-to-equity",D
High School,Advanced Accounting,"Impairment loss equals carrying value minus?","Accumulated depreciation","Recoverable amount","Book value","Market value",B
High School,Advanced Accounting,"Noncontrolling interest appears in?","Expense section","Equity section","Liabilities only","Revenue section",B
High School,Advanced Accounting,"Capital budgeting decisions commonly use?","Current ratio","Inventory turnover","EPS only","Net present value",D
High School,Advanced Accounting,"Operating leverage is highest when?","Fixed costs are high","Sales are declining","No fixed costs","Variable costs are high",A
High School,Advanced Accounting,"Which method is used to account for joint ventures under significant influence?","Consolidation","Cost method","Equity method","Cash method",C
High School,Advanced Accounting,"Free cash flow is commonly defined as operating cash flow minus?","Capital expenditures","Taxes paid","Dividends paid","Interest expense",A
High School,Advanced Accounting,"Stock buybacks generally reduce?","Outstanding shares","Revenue","Net income","Earnings per share",A
High School,Advanced Accounting,"Financial statement analysis often begins with?","Dividend declaration","Ratio analysis","Auditing","Tax filing",B
High School,Advanced Accounting,"Which valuation approach discounts future cash flows?","Discounted cash flow","Market multiple","Historical cost","Book value method",A
High School,Advertising,"Advertising is primarily used to?","File taxes","Communicate value to a target audience","Reduce costs","Manage inventory",B
High School,Advertising,"The target market refers to?","Competitors","All consumers","Company employees","A specific group of potential customers",D
High School,Advertising,"Branding helps a company to?","Differentiate from competitors","Lower wages","Reduce taxes","Eliminate advertising",A
High School,Advertising,"Which media type includes television and radio?","Outdoor media","Print media","Direct mail","Broadcast media",D
High School,Advertising,"The AIDA model stands for Attention Interest Desire and?","Awareness","Appeal","Analysis","Action",D
High School,Advertising,"A slogan is used to?","Track inventory","Increase payroll","Summarize brand message","Calculate ROI",C
High School,Advertising,"Digital ads commonly appear on?","Packaging","Websites and apps","Billboards only","Newspapers only",B
High School,Advertising,"Market segmentation divides customers based on?","Employee skills","Production cost","Shared characteristics","Tax brackets",C
High School,Advertising,"Which of the following is an example of print media?","Television","Magazine","YouTube","Podcast",B
High School,Advertising,"Consumer behavior studies?","How customers make decisions","Supply chain logistics","Employee management","Tax compliance",A
High School,Advertising,"Reach refers to?","Time spent viewing","Number of people exposed to an ad","Ad cost per click","Ad frequency per person",B
High School,Advertising,"Frequency measures?","Times a person sees an ad","Market share","Revenue growth","Total cost of campaign",A
High School,Advertising,"A call to action encourages consumers to?","Take specific action","Ignore ad","Compare competitors","File complaint",A
High School,Advertising,"Brand loyalty occurs when consumers?","Repeat purchase consistently","Complain publicly","Avoid ads","Switch frequently",A
High School,Advertising,"Which platform is considered social media?","Direct mail","Billboard","Newspaper","Instagram",D
High School,Advertising,"Product positioning refers to?","How consumers perceive a brand","Factory location","Warehouse placement","Employee ranking",A
High School,Advertising,"Outdoor advertising includes?","Podcasts","Email campaigns","Billboards","Webinars",C
High School,Advertising,"An advertising budget determines?","Spending on promotion","Stock dividends","Employee salary","Product price only",A
High School,Advertising,"Integrated Marketing Communications ensures?","Inventory turnover","Reduced competition","Consistent messaging across channels","Mixed pricing",C
High School,Advertising,"Which metric measures clicks on digital ads?","Gross margin","ROI","CPM","CTR",D
High School,Advertising,"CPM stands for?","Customer purchase metric","Cost per message","Campaign performance measure","Cost per thousand impressions",D
High School,Advertising,"A push strategy targets?","Final consumers","Investors","Employees","Retailers and distributors",D
High School,Advertising,"A pull strategy encourages?","Consumer demand for product","Retail stocking only","Lower production","Internal promotions",A
High School,Advertising,"Brand equity represents?","Value derived from brand perception","Net income","Total assets","Inventory cost",A
High School,Advertising,"Demographic segmentation uses variables such as?","Website traffic","Personality only","Age and income","Sales quotas",C
High School,Advertising,"Market penetration strategy focuses on?","Raising prices only","Reducing advertising","New markets only","Increasing share in existing market",D
High School,Advertising,"Programmatic advertising uses?","Billboard negotiation","Manual ad buying","Automated digital ad placement","Direct mail only",C
High School,Advertising,"Return on advertising spend measures?","Inventory value","Market share only","Profit per employee","Revenue generated per ad dollar spent",D
High School,Advertising,"Emotional appeals in ads aim to?","Provide statistics only","Lower costs","Influence feelings and attitudes","Improve logistics",C
High School,Advertising,"Unique selling proposition highlights?","Tax benefit","Lowest wage rate","Distinct competitive advantage","Common features",C
High School,Advertising,"Brand repositioning is used to?","Increase inventory","Change consumer perception","Reduce employees","Eliminate marketing",B
High School,Advertising,"Media mix refers to?","Employee roles","Combination of advertising channels","Financial ratios","Product ingredients",B
High School,Advertising,"Cost per acquisition measures?","Impressions only","Employee productivity","Market share growth","Cost to gain one customer",D
High School,Advertising,"Behavioral targeting uses?","Print subscriptions","Geographic location only","Warehouse logs","Customer browsing data",D
High School,Advertising,"The hierarchy of effects model includes cognition affect and?","Behavior","Inventory","Taxation","Production",A
High School,Advertising,"Advertising elasticity measures?","Responsiveness of demand to advertising","Price stability","Employee turnover","Cost inflation",A
High School,Advertising,"Native advertising is designed to?","Blend with platform content","Stand out visually","Reduce digital traffic","Avoid regulation",A
High School,Advertising,"Ethical advertising requires?","Exaggerated results","Truthful representation","Misleading claims","Hidden fees",B
High School,Advertising,"Comparative advertising compares?","Competing brands","Production methods","Employee performance","Internal departments",A
High School,Advertising,"Share of voice refers to?","Product features","Market share","Advertising presence compared to competitors","Employee headcount",C
High School,Advertising,"Brand awareness is measured by?","Inventory count","Recognition and recall metrics","Tax liability","Net income",B
High School,Advertising,"Conversion rate equals conversions divided by?","Employees","Total visitors or clicks","Total costs","Total revenue",B
High School,Advertising,"Geotargeting delivers ads based on?","Income level only","Physical location data","Inventory size","Employee age",B
High School,Advertising,"Advertising wearout occurs when?","Ad becomes more effective","Sales spike","Audience becomes fatigued","Costs decrease",C
High School,Advertising,"Customer lifetime value estimates?","Cost per impression","Advertising budget","Revenue from one purchase","Long-term profitability per customer",D
High School,Advertising,"The diffusion of innovation theory explains?","Adoption over time","Product shipping","Tax growth","Employee retention",A
High School,Advertising,"Impression share represents?","Cost per thousand","Actual impressions divided by eligible impressions","Total clicks only","Revenue per sale",B
High School,Advertising,"Multi-touch attribution assigns credit to?","Only last click","Single interaction only","Multiple customer touchpoints","Only first click",C
High School,Advertising,"Ad frequency capping prevents?","Overexposure to same user","Underbudgeting","Inventory shortage","Market expansion",A
High School,Advertising,"Positioning map visually compares brands based on?","Financial ratios","Employee size","Two key attributes","Warehouse location",C
High School,Agribusiness,"What is agribusiness?","The business of farming and related activities","Environmental activism only","Software development for farms","Urban retail marketing",A
High School,Agribusiness,"Which organization collects U.S. agricultural statistics?","IRS","USDA","FDA","SEC",B
High School,Agribusiness,"What is a commodity crop?","A crop grown primarily for sale","Food grown only for home use","A crop grown indoors","A genetically modified crop",A
High School,Agribusiness,"Which factor most affects crop yield?","Advertising budget","Office design","Social media trends","Weather conditions",D
High School,Agribusiness,"What is supply in economics?","A tax rate","Government price control","Quantity producers are willing to sell","Quantity consumers want to buy",C
High School,Agribusiness,"Which is an example of livestock?","Corn","Soybeans","Wheat","Cattle",D
High School,Agribusiness,"What does USDA stand for?","United States Development Agency","United States Department of Agriculture","Union of State Dairy Associations","United Services Data Authority",B
High School,Agribusiness,"What is a cooperative in agribusiness?","A government agency","A business owned by its members","A private corporation","A nonprofit charity",B
High School,Agribusiness,"Which input is essential for plant growth?","Water","Steel","Plastic","Concrete",A
High School,Agribusiness,"What is farm mechanization?","A pricing strategy","Organic certification process","Use of machinery in farming","Manual harvesting only",C
High School,Agribusiness,"Which crop is primarily grown for grain?","Lettuce","Broccoli","Carrots","Wheat",D
High School,Agribusiness,"What is agronomy?","Science of soil and crop production","Food advertising","Farm accounting","Animal surgery",A
High School,Agribusiness,"Which is a common fertilizer nutrient?","Sodium chloride","Helium","Carbon dioxide","Nitrogen",D
High School,Agribusiness,"What does GMO stand for?","Grain Market Order","Global Marketing Operation","Government Managed Output","Genetically Modified Organism",D
High School,Agribusiness,"Which sector processes raw agricultural products?","Food processing industry","Software industry","Mining industry","Automobile manufacturing",A
High School,Agribusiness,"What is irrigation?","Artificial application of water to crops","Natural rainfall only","Crop insurance policy","Seed storage",A
High School,Agribusiness,"Which is an example of agribusiness marketing?","Vaccinating cattle","Feeding livestock","Selling produce to grocery chains","Repairing tractors",C
High School,Agribusiness,"What is soil erosion?","Adding fertilizer","Loss of topsoil by wind or water","Increase in soil nutrients","Soil testing",B
High School,Agribusiness,"Which agency regulates meat inspection in the U.S.?","USDA Food Safety and Inspection Service","SEC","Department of Commerce","EPA Treasury Division",A
High School,Agribusiness,"What is crop rotation?","Alternating crops on the same land","Harvesting by machine","Selling crops online","Planting only one crop yearly",A
High School,Agribusiness,"What is vertical integration in agribusiness?","Hiring more employees","Increasing farm acreage","Using taller silos","Owning multiple stages of production",D
High School,Agribusiness,"What is a futures contract used for?","Hedging price risk","Marketing on social media","Applying pesticides","Increasing fertilizer use",A
High School,Agribusiness,"Which factor influences global agricultural trade?","Paint color of tractors","Exchange rates","Local gym membership","Office layout",B
High School,Agribusiness,"What is precision agriculture?","Handwritten bookkeeping","Traditional barter trading","Using data and GPS for farm management","Manual planting methods",C
High School,Agribusiness,"What does EBITDA measure?","Soil moisture","Operating profitability","Seed germination rate","Market share",B
High School,Agribusiness,"What is biosecurity in livestock operations?","Financial audits","Brand design","Measures to prevent disease spread","Advertising campaigns",C
High School,Agribusiness,"Which organization publishes global food security data?","FAO","NASA","FTC","FCC",A
High School,Agribusiness,"What is value-added agriculture?","Reducing farm size","Eliminating marketing","Processing raw products into higher-value goods","Planting fewer crops",C
High School,Agribusiness,"What does sustainability in agribusiness emphasize?","Eliminating mechanization","Environmental, economic, and social balance","Maximum short-term profit only","Ending exports",B
High School,Agribusiness,"What is crop insurance designed to protect against?","Office damage","Yield or revenue losses","Equipment theft only","Website outages",B
High School,Agribusiness,"What is the primary purpose of the Farm Bill?","Establish agricultural and nutrition policy","Control monetary policy","Regulate stock markets","Oversee transportation infrastructure",A
High School,Agribusiness,"What is the Herfindahl-Hirschman Index used to measure?","Soil pH","Market concentration","Water quality","Plant density",B
High School,Agribusiness,"Which pricing strategy adjusts prices based on demand fluctuations?","Cost-only pricing","Flat pricing","Dynamic pricing","Barter pricing",C
High School,Agribusiness,"What is carbon sequestration in agriculture?","Increasing fertilizer use","Capturing carbon in soil or biomass","Releasing methane from cattle","Burning crop residue",B
High School,Agribusiness,"What is the role of the Commodity Futures Trading Commission?","Regulate futures markets","Approve pesticides","Inspect meat plants","Set farm wages",A
High School,Agribusiness,"What does ESG reporting evaluate in agribusiness firms?","Crop insurance claims","Environmental, social, governance performance","Feed conversion ratios","Seed germination rates",B
High School,Agribusiness,"What is a supply chain disruption?","Price stabilization","Government subsidy","Improved logistics efficiency","Interruption in production or distribution flow",D
High School,Agribusiness,"What is regenerative agriculture?","Hydrocarbon extraction","Industrial monocropping","Urban manufacturing","Farming practices that restore soil health",D
High School,Agribusiness,"Which policy tool stabilizes farmer income during price drops?","Corporate bonds","Countercyclical payments","Payroll taxes","Import bans only",B
High School,Agribusiness,"What does traceability in food systems allow?","Eliminating labeling","Reducing exports","Increasing pesticide use","Tracking products through supply chain",D
High School,Agribusiness,"What is marginal cost in farm production?","Average price","Total fixed cost","Cost of producing one additional unit","Total revenue",C
High School,Agribusiness,"Which global agreement impacts agricultural trade tariffs?","WTO agreements","UNESCO treaty","OPEC charter","Paris Stock Exchange rules",A
High School,Agribusiness,"What is vertical farming?","Indoor farming using controlled environments","Offshore aquaculture","Plowing steep hillsides","Planting tall crops",A
High School,Agribusiness,"What is agtech?","Soil type","Government subsidy","Animal feed brand","Technology applied to agriculture",D
High School,Agribusiness,"What is a price floor?","Variable tax rate","Shipping cost","Maximum price cap","Minimum legal price",D
High School,Agribusiness,"What is a derivative in commodity markets?","Organic fertilizer","Storage bin","Hybrid seed","Financial contract based on asset value",D
High School,Agribusiness,"What is risk diversification in agribusiness?","Planting one crop only","Eliminating machinery","Selling only locally","Spreading investments across activities",D
High School,Agribusiness,"What does CAP refer to in the EU context?","Corporate Accounting Plan","Consumer Aid Project","Crop Allocation Program","Common Agricultural Policy",D
High School,Agribusiness,"What is food security?","Import dependency","Organic certification","Access to sufficient safe food","Maximum farm output only",C
High School,Agribusiness,"What is supply elasticity?","Total farm acreage","Labor union size","Soil fertility rate","Responsiveness of supply to price change",D
High School,Business Communication,"What is the primary purpose of business communication?","To exchange information effectively in a professional setting","To entertain coworkers","To replace management","To eliminate meetings",A
High School,Business Communication,"Which is an example of written communication?","Phone call","Team huddle","Email","Video conference",C
High School,Business Communication,"What does nonverbal communication include?","Typed messages","Body language","Financial statements","Spoken words",B
High School,Business Communication,"What is the purpose of a subject line in an email?","Attach files","Provide a signature","Replace the greeting","Summarize the message topic",D
High School,Business Communication,"Which tone is most appropriate in professional emails?","Casual slang","Clear and respectful","Aggressive","Dismissive",B
High School,Business Communication,"What is active listening?","Hearing without responding","Multitasking during conversation","Interrupting frequently","Fully concentrating and responding thoughtfully",D
High School,Business Communication,"Which is a barrier to communication?","Simple language","Clear feedback","Organized structure","Noise and distractions",D
High School,Business Communication,"What is feedback in communication?","Initial greeting","Marketing plan","Company policy","Response to a message",D
High School,Business Communication,"Which format is commonly used for business letters?","Block format","Poetry format","Text message format","Narrative fiction format",A
High School,Business Communication,"What is the purpose of a meeting agenda?","Approve budgets","Replace meeting minutes","Outline topics to be discussed","Assign salaries",C
High School,Business Communication,"Which communication channel is best for urgent issues?","Brochure","Newsletter","Printed memo","Phone call",D
High School,Business Communication,"What is clarity in communication?","Adding humor","Avoiding details","Using jargon excessively","Using simple and precise language",D
High School,Business Communication,"What is a memorandum (memo)?","External advertisement","Internal business message","Legal lawsuit","Financial audit",B
High School,Business Communication,"Which is an example of formal communication?","Emoji reaction","Casual chat","Annual report","Text slang",C
High School,Business Communication,"What does CC mean in email?","Carbon copy","Corporate channel","Customer contact","Confidential communication",A
High School,Business Communication,"Which skill improves presentations?","Skipping structure","Practice and preparation","Reading slides word-for-word","Avoiding eye contact",B
High School,Business Communication,"What is cross-cultural communication?","Sending mass emails","Using technical jargon","Talking only to managers","Communicating across different cultures",D
High School,Business Communication,"What is professional etiquette?","Accepted workplace behavior rules","Financial forecasting","Software coding","Personal hobbies",A
High School,Business Communication,"What is the purpose of proofreading?","Change formatting randomly","Increase word count","Check for errors before sending","Add graphics",C
High School,Business Communication,"Which is an example of visual communication?","Podcast","Voicemail","Charts and graphs","Conference call",C
High School,Business Communication,"What is the communication process model?","Sender, message, channel, receiver, feedback","Sales funnel diagram","Budget spreadsheet","Company hierarchy chart",A
High School,Business Communication,"Which is a benefit of upward communication?","Provides management feedback","Prevents collaboration","Reduces transparency","Eliminates teamwork",A
High School,Business Communication,"What is emotional intelligence in communication?","Ignoring others' feelings","Using complex words","Speaking loudly","Ability to understand and manage emotions",D
High School,Business Communication,"What is a SMART message objective?","Sales marketing tactic","Short and messy text","Standard memo attachment","Specific and measurable purpose",D
High School,Business Communication,"Which medium is best for detailed policy updates?","Instant message","Written report","Phone emoji","Quick voicemail",B
High School,Business Communication,"What does noise mean in communication theory?","Interference that distorts a message","Background music only","Office gossip","Formal presentation",A
High School,Business Communication,"What is persuasive communication?","Providing raw data only","Reading silently","Influencing audience decisions ethically","Ignoring feedback",C
High School,Business Communication,"What improves intercultural communication?","Avoidance","Assumptions","Cultural awareness training","Stereotyping",C
High School,Business Communication,"What is a stakeholder in communication?","Person with interest in outcome","Unrelated vendor","Former employee","Random bystander",A
High School,Business Communication,"What are meeting minutes?","Written record of discussions","Meeting invitation","Office layout","Marketing slogan",A
High School,Business Communication,"What is crisis communication?","Strategic messaging during emergencies","Daily status update","Team lunch planning","Holiday greeting",A
High School,Business Communication,"What principle guides ethical communication?","Honesty and transparency","Manipulation","Deception","Information withholding",A
High School,Business Communication,"What is stakeholder mapping used for?","Identifying influence and interest levels","Measuring bandwidth","Creating email lists only","Tracking payroll",A
High School,Business Communication,"What is a communication audit?","Legal deposition","Equipment repair","Evaluation of organizational communication effectiveness","Tax inspection",C
High School,Business Communication,"Which theory explains message framing effects?","Supply curve theory","Newton's law","Prospect theory","Maslow hierarchy only",C
High School,Business Communication,"What is brand voice?","Financial asset","Product packaging","Consistent organizational communication style","Legal trademark",C
High School,Business Communication,"What is asynchronous communication?","Communication not occurring in real time","Live meeting","Video conference","Phone call",A
High School,Business Communication,"What does GDPR primarily affect in communication?","Printer usage","Office seating plans","Corporate travel","Data privacy compliance",D
High School,Business Communication,"What is media richness theory?","Sales strategy","Framework ranking communication channels by effectiveness","Accounting principle","Advertising metric",B
High School,Business Communication,"What is change communication?","Quarterly dividend report","Inventory management","Messaging that supports organizational change","Customer billing cycle",C
High School,Business Communication,"What is a key element of executive summaries?","Detailed appendix","Footnotes only","Concise overview of key points","Technical formulas only",C
High School,Business Communication,"What is strategic alignment in communication?","Reducing word count","Ensuring messages support organizational goals","Increasing jargon","Eliminating meetings",B
High School,Business Communication,"Which metric measures communication engagement?","Office rent","Utility cost","Open and response rates","Warehouse size",C
High School,Business Communication,"What is narrative storytelling in business?","Using structured stories to convey ideas","Short bullet lists only","Reading spreadsheets verbatim","Ignoring audience needs",A
High School,Business Communication,"What is reputational risk communication?","Daily attendance tracking","Managing public perception during risk events","Internal payroll notice","Warehouse scheduling",B
High School,Business Communication,"What is the purpose of a press release?","Approve loans","Conduct performance review","Send invoices","Distribute official news to media",D
High School,Business Communication,"What is digital collaboration?","Using fax exclusively","Printing memos only","In-person meeting only","Using online tools to work together remotely",D
High School,Business Communication,"What is transparency in corporate communication?","Selective secrecy","False advertising","Open sharing of accurate information","Confidential rumor",C
High School,Business Communication,"What is message tailoring?","Ignoring demographics","Avoiding feedback","Adapting communication to audience needs","Using same script always",C
High School,Business Communication,"What is communication governance?","Inventory policy","Payroll processing","Warehouse inspection","Policies guiding organizational messaging",D
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
Middle School,Career Exploration,"What is the primary purpose of a job shadow?","To earn money","To observe a professional in their work environment","To replace the employee","To get a guaranteed job offer",B
Middle School,Career Exploration,"Which document lists your education, work experience, and skills?","Cover Letter","Resume","Reference List","Thank You Note",B
Middle School,Career Exploration,"A specific career path or group of similar jobs is called a:","Job Cluster","Career Cluster","Work Group","Profession Set",B
Middle School,Career Exploration,"What is the term for learning a trade by working under a skilled professional?","Internship","Apprenticeship","Volunteering","Shadowing",B
Middle School,Career Exploration,"Which of the following is a 'Soft Skill'?","Typing speed","Computer programming","Communication","Operating machinery",C
Middle School,Digital Citizenship,"What is a 'Digital Footprint'?","The weight of your laptop","The trail of data you create while using the internet","The physical size of a computer mouse","A biometric security feature",B
Middle School,Digital Citizenship,"Which practice helps protect against phishing attacks?","Clicking every link in emails","Verifying the sender's email address","Sharing passwords with friends","Disabling antivirus software",B
Middle School,Digital Citizenship,"What does 'Copyright' protect?","Inventions","Brand names","Original works of authorship","Scientific discoveries",C
Middle School,Digital Citizenship,"Cyberbullying includes:","Harassing someone online","Posting mean comments","Spreading rumors on social media","All of the above",D
Middle School,Digital Citizenship,"A strong password should contain:","Your name and birth year","123456","A mix of letters numbers and symbols","The word password",C
Middle School,Exploring Accounting & Finance,"What is the basic accounting equation?","Assets = Liabilities + Owner's Equity","Income = Expenses + Profit","Assets = Liabilities - Debt","Equity = Cash + Assets",A
Middle School,Exploring Accounting & Finance,"Which concept refers to the rise in the general level of prices?","Deflation","Inflation","Interest","Recession",B
Middle School,Exploring Accounting & Finance,"Money paid for the use of borrowed money is called:","Principal","Dividend","Interest","Equity",C
Middle School,Exploring Accounting & Finance,"A plan for spending and saving money is a:","Budget","Balance Sheet","Ledger","Audit",A
Middle School,Exploring Accounting & Finance,"Liquid assets are:","Assets that are frozen","Assets easily converted to cash","Long-term investments","Real estate properties",B
Middle School,Exploring Agribusiness,"What is the primary sector of the economy for agribusiness?","Manufacturing","Agriculture","Service","Technology",B
Middle School,Exploring Agribusiness,"Which term refers to the cultivation of aquatic animals/plants for food?","Hydroponics","Aquaculture","Agriculture","Horticulture",B
Middle School,Exploring Agribusiness,"Sustainable agriculture aims to:","Deplete natural resources","Maximize short-term profit only","Protect the environment for future generations","Avoid using technology",C
Middle School,Exploring Agribusiness,"A cooperative (co-op) is owned by:","The government","A single wealthy investor","Its members","Foreign competitors",C
Middle School,Exploring Agribusiness,"The detailed coordination of a complex operation involving many people, facilities, or supplies is:","Logistics","Marketing","Accounting","Sales",A
Middle School,Exploring Business Communication,"Which is a form of non-verbal communication?","Email","Body language","Phone call","Memo",B
Middle School,Exploring Business Communication,"In a business letter, the salutation is the:","Closing","Greeting","Signature","Body",B
Middle School,Exploring Business Communication,"Active listening involves:","Interrupting the speaker","Ignoring the speaker","Paying full attention and reflecting understanding","Planning your response while they talk",C
Middle School,Exploring Business Communication,"What is the most appropriate closing for a formal business letter?","Later,","Sincerely,","Yours,","Cheers,",B
Middle School,Exploring Business Communication,"Tone of voice in writing is conveyed through:","Font size","Word choice and sentence structure","Paper color","Ink color",B
Middle School,Exploring Business Concepts,"A business owned by one person is a:","Partnership","Corporation","Sole Proprietorship","Franchise",C
Middle School,Exploring Business Concepts,"What is 'Profit'?","Total Revenue - Total Expenses","Total Assets + Total Liabilities","Total Sales","Money borrowed",A
Middle School,Exploring Business Concepts,"The process of creating a new business is called:","Management","Entrepreneurship","Marketing","Accounting",B
Middle School,Exploring Business Concepts,"Which is a 'Good' (vs. Service)?","Haircut","Car repair","Computer","Legal advice",C
Middle School,Exploring Business Concepts,"Supply and Demand determines:","Taxes","Price in a market economy","Government regulation","Employee salaries",B
Middle School,Exploring Computer Science,"What does CPU stand for?","Central Processing Unit","Computer Personal Unit","Central Program Utility","Control Processing User",A
Middle School,Exploring Computer Science,"Which is an example of an Output device?","Keyboard","Mouse","Monitor","Microphone",C
Middle School,Exploring Computer Science,"The binary number system uses which digits?","1-10","0 and 1","0-9","1 and 2",B
Middle School,Exploring Computer Science,"What is 'Malware'?","Hardware malfunction","Malicious software","A secure network","An operating system",B
Middle School,Exploring Computer Science,"HTML stands for:","Hyper Text Markup Language","High Tech Modern Language","Home Tool Markup Language","Hyperlink Text Mode Logic",A
Middle School,Exploring Economics,"Scarcity exists because:","Resources are unlimited","Wants are limited","Resources are limited and wants are unlimited","Money is scarce",C
Middle School,Exploring Economics,"Opportunity Cost is:","The price of a product","The value of the next best alternative given up","The cost of production","The profit made",B
Middle School,Exploring Economics,"Which economic system relies on custom and history?","Market","Command","Traditional","Mixed",C
Middle School,Exploring Economics,"Gross Domestic Product (GDP) measures:","Total population","Total value of goods/services produced in a country","Total tax revenue","Stock market growth",B
Middle School,Exploring Economics,"When supply exceeds demand, a _____ occurs.","Shortage","Surplus","Equilibrium","Deficit",B
Middle School,Exploring FBLA,"What does FBLA stand for?","Future Business Leaders of America","First Business Leaders Association","Future Business Learners of America","Federal Business Law Administration",A
Middle School,Exploring FBLA,"The FBLA motto is:","Service, Education, Progress","Service, Education, Leadership","Leaders of Tomorrow","Progress through Service",A
Middle School,Exploring FBLA,"What are the official colors of FBLA?","Red and White","Blue and Gold","Navy Blue and Gold","Red and Black",B
Middle School,Exploring FBLA,"Who is the founder of FBLA?","Hamden L. Forkner","Edward D. Miller","Jean Buckley","Conrad Hilton",A
Middle School,Exploring FBLA,"The fiscal year for FBLA is:","Jan 1 - Dec 31","July 1 - June 30","Aug 1 - July 31","Sept 1 - Aug 31",B
Middle School,Exploring Leadership,"Which leadership style gives subordinates little input?","Democratic","Laissez-faire","Autocratic","Bureaucratic",C
Middle School,Exploring Leadership,"Integrity means:","Being popular","Doing the right thing even when no one is watching","Making the most money","Being the boss",B
Middle School,Exploring Leadership,"A mission statement describes:","The company's history","Current profits","The purpose of the organization","Employee salaries",C
Middle School,Exploring Leadership,"Delegation means:","Doing everything yourself","Assigning tasks to others","Ignoring tasks","Quitting",B
Middle School,Exploring Leadership,"Brainstorming is used to:","Generate ideas","Criticize ideas","Finalize a plan","Assign blame",A
Middle School,Exploring Marketing Concepts,"Detailed information about a target market is:","Demographics","Psychographics","Geographics","All of the above",D
Middle School,Exploring Marketing Concepts,"A logo is a:","Slogan","Visual symbol of a brand","Product name","Price tag",B
Middle School,Exploring Marketing Concepts,"The 4 P's of Marketing include:","Product, Price, Place, Promotion","Plan, Produce, Price, Profit","People, Planet, Profit, Product","Promotion, Planning, Placement, People",A
Middle School,Exploring Marketing Concepts,"Target Market refers to:","Everyone","The specific group a business wants to sell to","Competitors","Suppliers",B
Middle School,Exploring Marketing Concepts,"What is a Focus Group?","A group of employees","A group of customers gathered to give feedback","A management team","A sales meeting",B
Middle School,Exploring Parliamentary Procedure,"The official guide for FBLA Parliamentary Procedure is:","Robert's Rules of Order","The Constitution","Standard Code of Procedure","Gregg's Manual",A
Middle School,Exploring Parliamentary Procedure,"To introduce a new item of business, a member says:","I make a motion","I move that","I suggest","I propose",B
Middle School,Exploring Parliamentary Procedure,"A majority vote is:","50% of the vote","More than half of the votes cast","Two-thirds of the vote","Unanimous",B
Middle School,Exploring Parliamentary Procedure,"To end a meeting, a member moves to:","Adjourn","Recess","Quit","Stop",A
Middle School,Exploring Parliamentary Procedure,"The person running the meeting is the:","Secretary","Treasurer","Chair","Parliamentarian",C
Middle School,Exploring Personal Finance,"Pay yourself first means:","Buy what you want first","Save money before spending on anything else","Pay bills first","Pay taxes first",B
Middle School,Exploring Personal Finance,"A debit card draws money from:","A credit line","A savings account","A checking account","A loan",C
Middle School,Exploring Personal Finance,"Interest earned on interest is called:","Simple Interest","Compound Interest","Fixed Interest","Variable Interest",B
Middle School,Exploring Personal Finance,"The cost of borrowing money is:","Principal","Credit score","Interest","Debt",C
Middle School,Exploring Personal Finance,"Which is a 'Need' (vs. Want)?","Designer clothes","Video games","Basic food and shelter","Vacation",C
Middle School,Exploring Professionalism,"Punctuality means:","Being early or on time","Being late","Leaving early","Working specific hours",A
Middle School,Exploring Professionalism,"Appropriate business attire usually excludes:","Suit","Tie","Flip-flops","Dress shirt",C
Middle School,Exploring Professionalism,"Networking is:","Connecting computers","Building professional relationships","Socializing at a party","Using the internet",B
Middle School,Exploring Professionalism,"Ethical behavior involves:","Maximizing profit at all costs","Following moral principles","Doing whatever is legal","Ignoring rules",B
Middle School,Exploring Professionalism,"A strong work ethic includes:","Reliability and dedication","Procrastination","Complaining","Doing the bare minimum",A
Middle School,Exploring Technology,"Hardware refers to:","Computer programs","Physical components of a computer","Internet connection","Data",B
Middle School,Exploring Technology,"Software refers to:","The monitor","The keyboard","Programs and applications","The mouse",C
Middle School,Exploring Technology,"The 'Cloud' refers to:","Weather","Servers accessed over the internet","A type of hard drive","A wireless mouse",B
Middle School,Exploring Technology,"A URL is a:","Web address","Computer virus","Software patch","Hardware part",A
Middle School,Exploring Technology,"Which is an Operating System?","Microsoft Word","Google Chrome","Windows","Fortnite",C
Middle School,Interpersonal Communication,"Empathy is:","Feeling sorry for someone","Understanding and sharing the feelings of another","Ignoring feelings","Being angry",B
Middle School,Interpersonal Communication,"Constructive criticism is meant to:","Hurt feelings","Help improve","Embarrass","Punish",B
Middle School,Interpersonal Communication,"Non-verbal communication includes:","Facial expressions","Emails","Text messages","Phone calls",A
Middle School,Interpersonal Communication,"Conflict resolution is:","Ignoring the problem","Finding a peaceful solution to a disagreement","Winning the argument","Fighting",B
Middle School,Interpersonal Communication,"Teamwork requires:","Collaboration","Competition","Isolation","Dictatorship",A`;

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

    // Explicit category matching logic for better precision
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
