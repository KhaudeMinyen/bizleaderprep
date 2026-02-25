
export interface QuestionData {
  question: string;
  answer: string;
  options: string[];
}

const RAW_CSV = `Event Level,Category,Question,Answer A,Answer B,Answer C,Answer D,Correct
High School,Accounting,"Which financial statement reports a company's assets, liabilities, and equity?",Income Statement,Balance Sheet,Statement of Cash Flows,Trial Balance,B
High School,Accounting,"Assets are best defined as what a business owns, earns, owes, or invests?",What it owes,What it owns,What it earns,What it invests,B
High School,Accounting,Which accounting equation is correct?,Assets = Liabilities – Equity,Assets = Liabilities + Equity,Assets = Revenue + Expenses,Assets = Equity – Liabilities,B
High School,Accounting,Revenue is recorded when it is earned under which accounting basis?,Cash basis,Accrual basis,Modified cash basis,Tax basis,B
High School,Accounting,A journal entry must always include at least one debit and one _____.,Expense,Revenue,Credit,Asset,C
High School,Accounting,Which account type normally increases with a debit?,Revenue,Liability,Asset,Equity,C
High School,Accounting,Which statement shows revenues and expenses over a period of time?,Balance Sheet,Income Statement,Statement of Owner's Equity,Trial Balance,B
High School,Accounting,Accounts payable is classified as what type of account?,Asset,Liability,Expense,Revenue,B
High School,Accounting,Depreciation allocates the cost of a fixed asset over its _____.,Market value,Selling price,Useful life,Salvage value,C
High School,Accounting,Which of the following is a current asset?,Land,Equipment,Accounts Receivable,Building,C
High School,Accounting,The accounting cycle begins with what step?,Posting,Preparing a trial balance,Recording transactions in a journal,Preparing financial statements,C
High School,Accounting,Which document provides evidence of a transaction?,Audit report,Source document,Financial statement,Ledger,B
High School,Accounting,Expenses normally increase with which type of entry?,Credit,Debit,Adjustment,Closing entry,B
High School,Accounting,The trial balance is used to verify what?,Profitability,Cash flow,Equality of debits and credits,Inventory value,C
High School,Accounting,Inventory is classified as what type of asset?,Fixed asset,Current asset,Long-term liability,Equity,B
High School,Accounting,Net income equals revenues minus what?,Assets,Expenses,Liabilities,Equity,B
High School,Accounting,Which account is increased by a credit entry?,Revenue,Expense,Asset,Drawing,A
High School,Accounting,Prepaid insurance is classified as what type of account?,Liability,Expense,Asset,Revenue,C
High School,Accounting,Which financial statement shows cash inflows and outflows?,Balance Sheet,Income Statement,Statement of Cash Flows,Statement of Owner's Equity,C
High School,Accounting,Unearned revenue is classified as a _____.,Asset,Liability,Revenue,Expense,B
High School,Accounting,Which inventory method assumes the earliest goods purchased are sold first?,LIFO,Weighted Average,FIFO,Specific Identification,C
High School,Accounting,What is the purpose of adjusting entries?,Record owner investments,Update account balances at period end,Close temporary accounts,Reverse prior transactions,B
High School,Accounting,Accrued expenses represent expenses that are _____.,Paid in advance,Incurred but not yet paid,Received but not yet earned,Purchased on credit,B
High School,Accounting,The matching principle requires expenses to be recorded _____.,When paid,When billed,In the period revenue is earned,At year-end only,C
High School,Accounting,Which ratio measures a company's short-term liquidity?,Return on assets,Current ratio,Gross margin ratio,Debt ratio,B
High School,Accounting,Straight-line depreciation results in what expense pattern over time?,Increasing,Decreasing,Constant,Variable,C
High School,Accounting,Which account appears on a post-closing trial balance?,Revenue,Expense,Dividends,Retained Earnings,D
High School,Accounting,Cost of goods sold appears on which financial statement?,Balance Sheet,Income Statement,Cash Flow Statement,Trial Balance,B
High School,Accounting,A contra asset account typically carries what balance?,Debit,Credit,Zero,Temporary,B
High School,Accounting,The allowance for doubtful accounts estimates _____.,Future inventory losses,Uncollectible receivables,Depreciation expense,Revenue growth,B
High School,Accounting,"Under GAAP, revenue recognition requires satisfaction of a _____.",Customer payment,Performance obligation,Written contract,Invoice issuance,B
High School,Accounting,Which inventory method results in highest net income during a period of rising prices?,FIFO,LIFO,Weighted Average,Specific Identification,A
High School,Accounting,Comprehensive income includes net income plus _____.,Owner investments,Other comprehensive income items,Dividends paid,Operating expenses,B
High School,Accounting,Which ratio measures profitability relative to total assets?,Current ratio,Debt ratio,Return on assets,Inventory turnover,C
High School,Accounting,Deferred tax liabilities arise from _____.,Permanent differences,Temporary differences,Revenue misstatements,Inventory errors,B
High School,Accounting,Impairment occurs when a long-lived asset's carrying value exceeds its _____.,Book value,Salvage value,Recoverable amount,Accumulated depreciation,C
High School,Accounting,Which statement links net income to retained equity?,Balance Sheet,Statement of Retained Earnings,Cash Flow Statement,Trial Balance,B
High School,Accounting,Operating activities on the cash flow statement include _____.,Equipment purchases,Loan issuances,Cash received from customers,Dividend payments,C
High School,Accounting,Which costing method assigns overhead based on cost-driving activities?,Job order costing,Process costing,Activity-based costing,Standard costing,C
High School,Accounting,Inventory turnover ratio measures a company's _____.,Liquidity,Efficiency of inventory management,Solvency,Profitability,B
High School,Accounting,Which accounting principle assumes the business will continue operating indefinitely?,Conservatism,Going concern,Materiality,Consistency,B
High School,Accounting,Capitalizing an expenditure means recording it as a(n) _____.,Expense,Liability,Asset,Revenue,C
High School,Accounting,Which account reduces gross accounts receivable on the balance sheet?,Sales revenue,Allowance for doubtful accounts,Bad debt expense,Notes payable,B
High School,Accounting,Weighted average cost divides total cost by _____.,Units sold,Units purchased,Units available for sale,Ending inventory units,C
High School,Accounting,Contribution margin equals sales minus _____.,Fixed costs,Variable costs,Operating income,Total assets,B
High School,Accounting,Internal controls are designed primarily to prevent _____.,Revenue growth,Asset misuse and fraud,Profit increases,Inventory turnover,B
High School,Accounting,The quick ratio excludes which item from current assets?,Cash,Accounts receivable,Inventory,Marketable securities,C
High School,Accounting,Which temporary account closes to retained earnings at period end?,Dividends declared,Assets,Liabilities,Equipment,A
High School,Accounting,Accrual accounting recognizes revenue when _____.,Cash is received,Invoice is mailed,Performance obligation is satisfied,Customer deposits are made,C
High School,Accounting,The debt-to-equity ratio measures a company's _____.,Liquidity,Solvency and financial leverage,Efficiency,Profit margin,B
High School,Advanced Accounting,Which business structure can issue shares of stock?,Sole proprietorship,Partnership,Corporation,Nonprofit organization,C
High School,Advanced Accounting,Retained earnings represent a company's _____.,Cash held in reserve,Cumulative net income minus dividends,Total assets minus liabilities,Market value of stock,B
High School,Advanced Accounting,Which financial statement reports changes in stockholders' equity?,Income Statement,Balance Sheet,Statement of Retained Earnings,Cash Flow Statement,C
High School,Advanced Accounting,Par value of stock represents the _____.,Market price per share,Legal minimum capital per share,Dividend amount per share,Book value per share,B
High School,Advanced Accounting,Common stockholders typically have which right?,Guaranteed dividends,Priority in liquidation over creditors,Voting rights on corporate matters,Fixed interest payments,C
High School,Advanced Accounting,Preferred stockholders usually receive _____.,Voting control,Fixed dividends before common holders,Only residual profits,Management authority,B
High School,Advanced Accounting,Treasury stock refers to shares _____.,Authorized but never issued,Repurchased by the issuing company,Currently outstanding,Converted from bonds,B
High School,Advanced Accounting,A bond issued at a discount means the _____.,Coupon rate exceeds the market rate,Market rate exceeds the coupon rate,Bond sold above face value,Bond pays no interest,B
High School,Advanced Accounting,Bonds payable are classified as _____.,Equity,Current asset,Long-term liability,Revenue,C
High School,Advanced Accounting,Dividends declared become a(n) _____ until paid.,Expense,Liability,Asset,Revenue,B
High School,Advanced Accounting,Goodwill arises when a purchase price exceeds the _____.,Book value of liabilities,Fair value of net identifiable assets,Total assets acquired,Net income of acquiree,B
High School,Advanced Accounting,Earnings per share (EPS) is calculated as net income divided by _____.,Total assets,Weighted average shares outstanding,Total liabilities,Authorized shares,B
High School,Advanced Accounting,A partnership allocates profits based on _____.,Corporate tax rates,The partnership agreement,Equal division only,Number of employees,B
High School,Advanced Accounting,Convertible bonds can be exchanged for _____.,Cash,Inventory,Common stock,Preferred dividends,C
High School,Advanced Accounting,Amortization of bond discount _____ interest expense.,Decreases,Has no effect on,Increases,Eliminates,C
High School,Advanced Accounting,"When a corporation issues stock above par, the excess credit goes to _____.",Retained earnings,Additional paid-in capital,Treasury stock,Dividends payable,B
High School,Advanced Accounting,A stock split primarily affects _____.,Total equity value,Number of shares outstanding,Net income,Cash flows,B
High School,Advanced Accounting,Accumulated other comprehensive income appears in the _____ section.,Assets,Liabilities,Stockholders' equity,Income statement,C
High School,Advanced Accounting,Which ratio measures ability to cover interest payments with operating income?,Current ratio,Debt-to-equity ratio,Times interest earned,Inventory turnover,C
High School,Advanced Accounting,Managerial accounting information is primarily used for _____.,External reporting,Tax filing,Internal decision-making,SEC compliance,C
High School,Advanced Accounting,"Under the equity method, an investor recognizes income when _____.",Dividends are received,Investment is sold,The investee reports earnings,The stock price rises,C
High School,Advanced Accounting,Consolidated financial statements combine the parent with its _____.,Creditors,Subsidiaries,Customers,Suppliers,B
High School,Advanced Accounting,Minority interest (noncontrolling interest) represents _____.,The parent's ownership percentage,Non-controlling ownership in a subsidiary,Corporate liabilities to outsiders,Dividends declared to minority,B
High School,Advanced Accounting,Process costing is most appropriate for _____.,Customized individual jobs,Mass production of identical units,Consulting service firms,Service-only companies,B
High School,Advanced Accounting,Contribution margin ratio equals contribution margin divided by _____.,Sales revenue,Fixed costs,Total assets,Net income,A
High School,Advanced Accounting,A finance lease transfers _____ to the lessee.,Only short-term risk,Ownership-like risks and rewards,No asset recognition,Only maintenance expense,B
High School,Advanced Accounting,Diluted EPS accounts for _____.,Stock splits only,Convertible securities only,All potentially dilutive securities,Treasury stock repurchases only,C
High School,Advanced Accounting,Absorption costing includes _____ in product cost.,Only variable manufacturing costs,Only fixed overhead,Both fixed and variable manufacturing costs,Selling and administrative expenses,C
High School,Advanced Accounting,Segment reporting helps investors evaluate _____.,Aggregate tax liability,Performance of individual business units,Stock dividend amounts,Inventory counting errors,B
High School,Advanced Accounting,Return on equity (ROE) measures _____.,Profitability relative to shareholders' equity,Short-term liquidity,Asset utilization efficiency,Solvency position,A
High School,Advanced Accounting,"In a business combination, acquired assets must be recorded at _____.",Historical cost,Tax basis,Fair value at acquisition date,Replacement cost,C
High School,Advanced Accounting,Intercompany transactions in consolidation must be _____.,Recorded twice,Eliminated,Capitalized separately,Reported as minority interest,B
High School,Advanced Accounting,Deferred revenue is recognized as revenue when _____.,Cash is received,Contract is signed,Performance obligation is satisfied,Invoice is issued,C
High School,Advanced Accounting,Activity-based costing (ABC) assigns overhead using _____.,A single plantwide rate,Multiple activity-based cost drivers,Only direct labor hours,Standard cost rates,B
High School,Advanced Accounting,Financial leverage increases risk primarily because _____.,It reduces equity balance,It increases fixed financial obligations,It eliminates tax deductions,It raises dividend payments,B
High School,Advanced Accounting,Goodwill impairment must be tested at least _____.,Monthly,Quarterly,Annually,Every five years,C
High School,Advanced Accounting,Residual income equals operating income minus _____.,Income taxes,A capital charge on invested assets,Depreciation expense,Interest expense,B
High School,Advanced Accounting,"When bonds are issued at a premium, periodic interest expense is _____ the coupon payment.",Higher than,Equal to,Lower than,Unrelated to,C
High School,Advanced Accounting,Comprehensive income excludes _____.,Net income,Unrealized gains on AFS securities,Foreign currency translation adjustments,Cash dividends declared,D
High School,Advanced Accounting,Variable costing differs from absorption costing in that fixed manufacturing overhead is _____.,Capitalized as inventory,Expensed in the period incurred,Deferred indefinitely,Ignored entirely,B
High School,Advanced Accounting,Which ratio primarily evaluates a firm's capital structure?,Gross margin,Debt-to-equity,Inventory turnover,Current ratio,B
High School,Advanced Accounting,An impairment loss equals carrying value minus _____.,Market value,Original book value,Recoverable amount,Accumulated depreciation,C
High School,Advanced Accounting,Noncontrolling interest appears in the _____ section of consolidated statements.,Liabilities only,Stockholders' equity,Revenue section,Expense section,B
High School,Advanced Accounting,Capital budgeting decisions most commonly use _____.,Current ratio analysis,Net present value (NPV),Inventory turnover,Earnings per share only,B
High School,Advanced Accounting,Operating leverage is highest when _____.,Fixed costs are proportionally high,Variable costs are proportionally high,There are no fixed costs,Sales are sharply declining,A
High School,Advanced Accounting,The equity method is used to account for investments with _____ influence.,No,Significant (20-50%),Controlling (>50%),Minimal (<5%),B
High School,Advanced Accounting,Free cash flow is commonly defined as operating cash flow minus _____.,Interest expense,Dividends paid,Capital expenditures,Income taxes paid,C
High School,Advanced Accounting,Stock buybacks generally _____ earnings per share.,Decrease,Increase,Have no effect on,Eliminate,B
High School,Advanced Accounting,Financial statement analysis often begins with _____.,External auditing,Horizontal and ratio analysis,Tax return filing,Dividend declaration,B
High School,Advanced Accounting,The discounted cash flow (DCF) valuation approach _____.,Uses book value only,Applies market multiples,Discounts projected future cash flows,Relies on historical cost,C
High School,Advertising,Advertising is primarily used to _____.,Reduce production costs,Communicate value to a target audience,Manage warehouse inventory,Prepare tax filings,B
High School,Advertising,A target market refers to _____.,All possible consumers,Company competitors,A specific group of potential customers,Shareholders only,C
High School,Advertising,Branding helps a company to _____.,Lower employee wages,Differentiate its products from competitors,Eliminate advertising costs,Reduce income taxes,B
High School,Advertising,Which media type includes television and radio?,Print media,Broadcast media,Outdoor media,Direct mail,B
High School,Advertising,"The AIDA model stands for Attention, Interest, Desire, and _____.",Awareness,Action,Analysis,Appeal,B
High School,Advertising,A slogan is used to _____.,Increase payroll,Summarize and reinforce a brand's message,Calculate return on investment,Track inventory levels,B
High School,Advertising,Digital ads commonly appear on _____.,Billboards only,Websites and mobile apps,Printed newspapers only,Product packaging only,B
High School,Advertising,Market segmentation divides customers based on _____.,Production costs,Shared demographic or behavioral characteristics,Employee skill sets,Tax brackets,B
High School,Advertising,Which of the following is an example of print media?,Podcast,Magazine advertisement,YouTube pre-roll ad,Television commercial,B
High School,Advertising,Consumer behavior studies _____.,Employee management techniques,How and why customers make purchasing decisions,Tax compliance strategies,Supply chain logistics,B
High School,Advertising,Reach refers to the _____ of an advertising campaign.,Cost per click,Number of unique people exposed to an ad,Average frequency of ad exposure,Time spent viewing an ad,B
High School,Advertising,Frequency measures _____.,How many times a person is exposed to an ad,Total campaign cost,Revenue generated,Market share captured,A
High School,Advertising,A call to action (CTA) encourages consumers to _____.,Ignore an advertisement,Take a specific desired action,Compare all competitors,File a complaint,B
High School,Advertising,Brand loyalty occurs when consumers _____.,Switch brands frequently,Consistently repurchase the same brand,Complain publicly,Actively avoid advertising,B
High School,Advertising,Which platform is considered a social media channel?,Instagram,Printed newspaper,Direct mail piece,Billboard,A
High School,Advertising,Product positioning refers to how _____.,Products are stored in warehouses,Consumers perceive a brand relative to competitors,Factories determine locations,Employees are ranked,B
High School,Advertising,Outdoor advertising includes _____.,Email marketing campaigns,Billboards and transit ads,Online webinars,Podcast episodes,B
High School,Advertising,An advertising budget determines _____.,Employee salary levels,How much to spend on promotion,Product pricing only,Stock dividend amounts,B
High School,Advertising,Integrated Marketing Communications (IMC) ensures _____.,Mixed pricing strategies,Consistent messaging across all marketing channels,Reduced competition,Improved inventory turnover,C
High School,Advertising,Which digital metric measures the percentage of ad viewers who click on it?,CPM,Click-through rate (CTR),Return on investment,Gross margin,B
High School,Advertising,CPM in advertising stands for _____.,Cost per message,Cost per thousand impressions,Customer purchase metric,Campaign performance measure,B
High School,Advertising,A push strategy targets _____.,Final consumers directly,Retailers and distributors in the channel,Only company employees,Investors and analysts,B
High School,Advertising,A pull strategy is designed to _____.,Stock shelves with products,Create consumer demand that pulls products through the channel,Lower production costs,Promote internal company events,B
High School,Advertising,Brand equity represents _____.,Total asset value,Added value derived from brand name and perception,Raw material inventory cost,Net income of the company,B
High School,Advertising,Demographic segmentation uses variables such as _____.,"Age, income, and gender",Personality traits only,Website traffic data,Monthly sales quotas,A
High School,Advertising,A market penetration strategy focuses on _____.,Only new geographic markets,Increasing share in an existing market,Solely raising prices,Reducing advertising investment,B
High School,Advertising,Programmatic advertising refers to _____.,Manual ad buying and placement,Automated digital ad buying and placement,Direct mail only,Billboard negotiation,B
High School,Advertising,Return on advertising spend (ROAS) measures _____.,Profit per employee,Revenue generated per dollar of ad spend,Market share alone,Inventory value,B
High School,Advertising,Emotional appeals in advertising aim to _____.,Provide only statistical data,Influence consumer feelings and attitudes,Lower production costs,Improve logistics operations,B
High School,Advertising,A unique selling proposition (USP) highlights a brand's _____.,Common shared features,Distinct competitive advantage,Lowest wage rate,Tax benefit structure,B
High School,Advertising,Brand repositioning is used to _____.,Increase warehouse inventory,Change consumer perception of a brand,Reduce employee headcount,Eliminate marketing spend,B
High School,Advertising,Media mix refers to the _____.,Ingredients of a product,Combination of advertising channels used in a campaign,Roles of marketing employees,Financial ratios used in analysis,B
High School,Advertising,Cost per acquisition (CPA) measures _____.,Total impressions only,Cost to acquire one new customer,Market share growth rate,Employee productivity,B
High School,Advertising,Behavioral targeting uses _____ to deliver relevant ads.,Consumer browsing and purchase data,Geographic location data only,Print subscription records,Warehouse inventory logs,A
High School,Advertising,"The hierarchy of effects model includes stages of cognition, affect, and _____.",Behavior (conation),Inventory replenishment,Production planning,Tax calculation,A
High School,Advertising,Advertising elasticity measures the _____.,Stability of ad prices,Responsiveness of demand to changes in advertising spend,Employee turnover rate,Cost of inflation,B
High School,Advertising,Native advertising is designed to _____.,Stand out visually from content,Blend naturally with the platform's content format,Reduce digital traffic,Avoid all regulatory oversight,B
High School,Advertising,Ethical advertising requires _____.,Misleading claims about competitors,Truthful and non-deceptive representation,Hidden fees in promotions,Exaggerated product results,B
High School,Advertising,Comparative advertising directly compares _____.,Internal company departments,A brand's product with competing brands,Employee performance records,Production methods,B
High School,Advertising,Share of voice (SOV) refers to a brand's _____.,Total market capitalization,Advertising presence relative to total category spend,Number of employees,Product feature count,B
High School,Advertising,Brand awareness is typically measured through _____.,Inventory count accuracy,Consumer recognition and recall metrics,Net income calculations,Total tax liability,B
High School,Advertising,Conversion rate equals conversions divided by _____.,Total revenue generated,Total visitors or ad clicks,Total marketing costs,Number of employees,B
High School,Advertising,Geotargeting delivers ads based on a user's _____.,Income level only,Physical location data,Employee age,Inventory size,B
High School,Advertising,Advertising wearout occurs when _____.,An ad becomes more effective with exposure,The audience becomes fatigued and less responsive,Campaign costs decrease,Sales suddenly spike,B
High School,Advertising,Customer lifetime value (CLV) estimates _____.,Revenue from a single transaction,Total long-term profitability per customer relationship,Cost per ad impression,Advertising budget required,B
High School,Advertising,The diffusion of innovation theory describes _____.,How products are shipped globally,How new products are adopted over time by different groups,How taxes grow over time,How employee retention improves,B
High School,Advertising,Impression share represents _____.,Actual impressions divided by estimated eligible impressions,Total clicks only,Revenue per ad sale,Cost per thousand impressions,A
High School,Advertising,Multi-touch attribution assigns conversion credit to _____.,The single first interaction only,Multiple customer touchpoints across the journey,Only the last ad clicked,Only the first ad clicked,B
High School,Advertising,Ad frequency capping is implemented to prevent _____.,Overexposure to the same ad for a single user,Underbudgeting on campaigns,Inventory shortages,Market expansion,A
High School,Advertising,A positioning map visually compares brands based on _____.,Financial performance ratios,Two key attributes relevant to consumers,Employee headcount,Warehouse location,B
High School,Agribusiness,Agribusiness is best described as _____.,Urban retail marketing,The business of farming and related agricultural industries,Software development for farms,Environmental activism,A
High School,Agribusiness,Which federal agency collects and publishes U.S. agricultural statistics?,USDA (U.S. Department of Agriculture),SEC,FDA,IRS,A
High School,Agribusiness,A commodity crop is a crop grown primarily for _____.,Sale in the marketplace,Home consumption only,Decoration purposes,Indoor growing,A
High School,Agribusiness,Which factor most directly affects crop yield?,Office interior design,Weather and climate conditions,Advertising budget,Social media strategy,B
High School,Agribusiness,"In economics, supply refers to _____.",The quantity consumers want to buy,The quantity producers are willing and able to sell,A government price control,A type of tax,B
High School,Agribusiness,Which of the following is an example of livestock?,Cattle,Corn,Soybeans,Wheat,A
High School,Agribusiness,What does USDA stand for?,United States Development Agency,United States Department of Agriculture,Union of State Dairy Associations,United Services Data Authority,B
High School,Agribusiness,A cooperative in agribusiness is a business _____.,Owned by shareholders on a stock exchange,Owned and controlled by its members,Operated solely by the government,A private for-profit corporation,B
High School,Agribusiness,Which input is essential for plant growth?,Plastic,Steel,Water and sunlight,Concrete,C
High School,Agribusiness,Farm mechanization refers to _____.,Only manual harvesting methods,Organic certification processes,The use of machinery in farming operations,A type of pricing strategy,C
High School,Agribusiness,Which crop is primarily grown for grain production?,Carrots,Lettuce,Wheat,Broccoli,C
High School,Agribusiness,Agronomy is the science of _____.,Animal surgery,Farm financial accounting,Crop production and soil management,Food advertising,C
High School,Agribusiness,Which is a commonly used macronutrient fertilizer for crops?,Helium,Sodium chloride,Carbon dioxide,Nitrogen,D
High School,Agribusiness,What does GMO stand for?,Government Managed Output,Grain Market Order,Global Marketing Operation,Genetically Modified Organism,D
High School,Agribusiness,Which sector processes raw agricultural products into consumer goods?,Software industry,The food processing industry,Mining industry,Automobile manufacturing,B
High School,Agribusiness,Irrigation is best defined as _____.,Natural rainfall management,A crop insurance policy,Seed storage practices,Artificial application of water to crops,D
High School,Agribusiness,Which activity represents agribusiness marketing?,Feeding livestock daily,Vaccinating cattle,Repairing farm equipment,Selling produce to grocery retail chains,D
High School,Agribusiness,Soil erosion refers to _____.,An increase in soil nutrients,Loss of topsoil by wind or water action,Adding fertilizer to fields,Testing soil pH levels,B
High School,Agribusiness,Which agency is responsible for meat inspection in the U.S.?,USDA Food Safety and Inspection Service (FSIS),SEC,EPA Treasury Division,Department of Commerce,A
High School,Agribusiness,Crop rotation involves _____.,Planting only one crop every year,Harvesting crops by machine,Alternating crops grown on the same land each season,Selling crops through online markets,A
High School,Agribusiness,Vertical integration in agribusiness means _____.,Only increasing farm acreage,Using taller grain silos,Owning multiple stages of the production and distribution process,Hiring more seasonal workers,C
High School,Agribusiness,A futures contract is most commonly used to _____.,Increase fertilizer purchases,Hedge against price risk for commodities,Market products on social media,Apply pesticides more efficiently,B
High School,Agribusiness,Which factor significantly influences global agricultural trade flows?,Paint color of tractors,Office layout of farms,Exchange rates and currency values,Local gym memberships,C
High School,Agribusiness,Precision agriculture uses _____ to optimize farm management.,Manual planting methods only,Traditional barter trading,"GPS, sensors, and data analytics",Handwritten bookkeeping,C
High School,Agribusiness,EBITDA is a financial metric measuring _____.,Soil moisture content,Seed germination rate,Operating profitability before non-cash items,Market share percentage,C
High School,Agribusiness,Biosecurity in livestock operations refers to _____.,Financial auditing of livestock costs,Brand design for farm products,Advertising campaigns for meat products,Measures taken to prevent the spread of disease,D
High School,Agribusiness,Which organization publishes global food security and agricultural data?,FTC,NASA,FAO (Food and Agriculture Organization),FCC,C
High School,Agribusiness,Value-added agriculture involves _____.,Reducing farm size,Eliminating distribution channels,Processing raw agricultural products into higher-value goods,Planting fewer crop varieties,C
High School,Agribusiness,Sustainability in agribusiness emphasizes _____.,Maximum short-term profit only,Eliminating all machinery,Ending agricultural exports,"Balancing environmental, economic, and social goals",D
High School,Agribusiness,Crop insurance is designed to protect farmers against _____.,Only equipment theft,Office property damage,Website outages,Crop yield or revenue losses from natural disasters,D
High School,Agribusiness,The primary purpose of the U.S. Farm Bill is to _____.,Regulate stock markets,Oversee transportation infrastructure,Control monetary policy,"Establish agricultural, nutrition, and rural policy",D
High School,Agribusiness,The Herfindahl-Hirschman Index (HHI) is used to measure _____.,Soil pH levels,Water quality,Market concentration in an industry,Plant density per acre,C
High School,Agribusiness,A dynamic pricing strategy in agribusiness adjusts prices based on _____.,Fixed cost structures only,Only competitor prices,Barter exchange rates,Real-time supply and demand fluctuations,D
High School,Agribusiness,Carbon sequestration in agriculture refers to _____.,Releasing methane from cattle,Increasing synthetic fertilizer use,Burning crop residue for energy,Capturing and storing carbon in soil or plant biomass,D
High School,Agribusiness,The Commodity Futures Trading Commission (CFTC) regulates _____.,Meat packing plant inspections,Pesticide approvals,Farm wage standards,U.S. futures and derivatives markets,D
High School,Agribusiness,ESG reporting in agribusiness evaluates _____.,Only seed germination rates,Crop insurance claims,Feed conversion ratios,"Environmental, social, and governance performance",D
High School,Agribusiness,A supply chain disruption is best described as _____.,Improved logistics efficiency,Price stabilization,Government subsidy distribution,Interruption in the flow of goods or services in the supply chain,D
High School,Agribusiness,Regenerative agriculture focuses on _____.,Industrial monocrop expansion,Urban manufacturing processes,Hydrocarbon extraction from fields,Farming practices that restore soil health and biodiversity,D
High School,Agribusiness,Countercyclical payments in agricultural policy are designed to _____.,Ban all agricultural imports,Issue corporate bonds to farmers,Impose payroll taxes on farm workers,Stabilize farmer income during periods of low commodity prices,D
High School,Agribusiness,Traceability in food systems allows _____.,Increased pesticide application,Reduction of all agricultural exports,Elimination of food labeling requirements,Tracking of food products through the entire supply chain,D
High School,Agribusiness,Marginal cost in farm production is the cost of _____.,Total fixed expenses,Total revenue generated,Average commodity price,Producing one additional unit of output,D
High School,Agribusiness,Which global agreement most directly impacts agricultural trade tariffs?,OPEC charter,Paris Stock Exchange rules,UNESCO treaty,World Trade Organization (WTO) agreements,D
High School,Agribusiness,Vertical farming refers to _____.,Plowing steep hillside terrain,Offshore aquaculture practices,Planting unusually tall crop varieties,Indoor farming using stacked layers in controlled environments,D
High School,Agribusiness,Agtech refers to _____.,A specific soil classification,A government agricultural subsidy,The application of technology and innovation to agriculture,A type of animal feed brand,C
High School,Agribusiness,A price floor is a government-set _____.,Maximum allowable price,Variable tax rate,Shipping cost structure,Minimum price that can be charged for a product,D
High School,Agribusiness,A derivative in commodity markets is _____.,A type of organic fertilizer,A hybrid seed variety,A grain storage unit,A financial contract whose value is based on an underlying asset,D
High School,Agribusiness,Risk diversification in agribusiness involves _____.,Planting only one crop type,Eliminating all farm machinery,Selling exclusively to local buyers,"Spreading investments across multiple crops, markets, or activities",D
High School,Agribusiness,The Common Agricultural Policy (CAP) refers to _____.,Corporate Accounting Plan,Crop Allocation Program,Consumer Aid Project,The European Union's framework for agricultural subsidies and trade,D
High School,Agribusiness,Food security is defined as _____.,Maximum agricultural output only,Complete import dependency,Requiring organic certification,"Reliable access to sufficient, safe, and nutritious food",D
High School,Agribusiness,Supply elasticity measures _____.,Total farm acreage available,Soil fertility rating,Labor union membership size,The responsiveness of quantity supplied to a change in price,D
High School,Business Communication,The primary purpose of business communication is to _____.,Entertain audiences,Promote only products,Replace management functions,Exchange information to achieve organizational goals,D
High School,Business Communication,Which of the following is an example of written communication?,Phone call,Email,Video conference,Verbal presentation,B
High School,Business Communication,Nonverbal communication includes _____.,Spoken words only,Written messages only,"Body language, gestures, and facial expressions",Text messaging,C
High School,Business Communication,Active listening involves _____.,Interrupting politely,Multitasking during conversation,Preparing your rebuttal while the speaker talks,Fully concentrating and thoughtfully responding,D
High School,Business Communication,Which is an example of formal business communication?,Texting a coworker slang,An official company memo,A social media comment,A casual hallway conversation,B
High School,Business Communication,Tone in writing refers to _____.,Font size chosen,The attitude or feeling conveyed in a message,Grammatical rules followed,The file format used,B
High School,Business Communication,Which of the following is a common barrier to effective communication?,Clear and precise language,Constructive feedback,Noise and distractions,Thorough preparation,C
High School,Business Communication,Feedback in communication refers to _____.,Ignoring the original message,The receiver's response to a message,Repeating the same words,Abruptly changing topics,B
High School,Business Communication,Which format is most commonly used for formal business letters?,Block format,Poetry format,Script format,Comic format,A
High School,Business Communication,The purpose of a subject line in a professional email is to _____.,Decorate the message,Identify and summarize the topic of the message,Add an attachment,Increase the word count,B
High School,Business Communication,Which skill most improves verbal presentations?,Reading slides word-for-word,Monotone delivery style,Ignoring the audience,Clear articulation and consistent eye contact,D
High School,Business Communication,Professional etiquette refers to _____.,Personal hobbies,Accepted standards of workplace behavior,Office décor preferences,Typing speed benchmarks,B
High School,Business Communication,Which communication channel is best suited for urgent matters?,Printed monthly newsletter,Postal mail delivery,Annual written report,Face-to-face conversation or phone call,D
High School,Business Communication,Clarity in communication means _____.,Using complex vocabulary,Being deliberately vague,Speaking as loudly as possible,"Being easily understood through simple, direct language",D
High School,Business Communication,Which document summarizes the discussion and decisions of a meeting?,Invoice,Meeting agenda,Minutes of the meeting,Employee resume,C
High School,Business Communication,A meeting agenda is used to _____.,Record final decisions,Outline topics and schedule for a meeting,Advertise products,File financial records,B
High School,Business Communication,Which is an example of digital communication?,Handwritten memo,Smoke signals,Notice posted on a bulletin board,An email newsletter,D
High School,Business Communication,Why is proofreading important in business communication?,It increases document length,It ensures accuracy and professionalism,It adds more graphics,It delays submission intentionally,B
High School,Business Communication,Which writing style is appropriate for professional business emails?,Informal slang,Heavy use of emojis,Only abbreviations,"Professional, clear, and concise language",D
High School,Business Communication,A memo is typically used for _____.,External advertising,Billing customers,Legal contracts,Internal communication within an organization,D
High School,Business Communication,Cultural awareness in business communication involves _____.,Ignoring cultural differences,Enforcing communication uniformity,Understanding and respecting cultural differences,Limiting cross-cultural interaction,C
High School,Business Communication,Which is an example of persuasive communication?,A routine weekly status report,A sales pitch to a potential client,A standard policy manual,An accounts payable invoice,B
High School,Business Communication,The purpose of an executive summary is to _____.,Provide only detailed background research,Add footnote citations,List all references used,Concisely summarize the key points of a longer report,D
High School,Business Communication,Upward communication flows _____.,From managers down to staff,From employees up to management,Only through external advertising,Via customer service emails,B
High School,Business Communication,Empathetic listening focuses on _____.,Analytical data processing,Understanding the speaker's emotions and perspective,Preparing a critical rebuttal,Passive hearing without engagement,B
High School,Business Communication,The goal of informative communication is to _____.,Entertain the audience only,Convince someone to make a purchase,Delay decision-making,Share clear and accurate information,D
High School,Business Communication,Which visual aid best enhances a business presentation?,Unreadable small-text charts,Cluttered slides with excessive text,A blank or empty screen,"Relevant, clearly labeled graphs and images",D
High School,Business Communication,A communication medium refers to _____.,The speaker delivering the message,Only the message receiver,The topic of the conversation,The channel used to transmit a message,D
High School,Business Communication,Conciseness in business writing improves _____.,Overall confusion,Document length,Report complexity,Clarity and communication efficiency,D
High School,Business Communication,Which factor most significantly affects cross-cultural business communication?,Font size preferences,Office floor layout,"Cultural norms, values, and language differences",Only the choice of communication channel,C
High School,Business Communication,A stakeholder in organizational communication is _____.,Only the CEO or executives,Only paying customers,Only current employees,Anyone with an interest in or affected by the organization's actions,D
High School,Business Communication,Which organizational structure supports clear logical flow in written reports?,Random ordering of ideas,Circular reasoning with no clear direction,Unrelated topic listing,Chronological or problem-solution format,D
High School,Business Communication,"In communication theory, 'noise' refers to _____.",Background music preferences,Formal presentation styles,Only audible physical sound,Any interference that distorts or blocks the message,D
High School,Business Communication,Empathy in professional communication means _____.,Ignoring others' viewpoints,Repeating instructions without context,Delivering criticism bluntly,Understanding and sharing the perspective of the receiver,D
High School,Business Communication,Which strategy best improves audience engagement in a presentation?,Delivering the script in a monotone,Turning your back to the audience,Skipping all visual aids,Asking relevant questions and encouraging participation,D
High School,Business Communication,A communication audit evaluates _____.,The company's financial statements,A marketing plan's return on investment,The design of a website,The effectiveness of organizational communication processes,D
High School,Business Communication,Which type of report presents both data and analysis to support a conclusion?,Analytical report,A personal thank-you memo,A standard invitation letter,A marketing brochure,A
High School,Business Communication,Credibility in communication is built on _____.,Speaking loudly and confidently,Elaborate slide animations,Email response speed,"Trustworthiness, expertise, and consistent accuracy",D
High School,Business Communication,Which element is essential in an effective persuasive business message?,Very long paragraphs of text,Random or unrelated statistics,Excessive technical jargon,A clear call to action aligned with audience needs,D
High School,Business Communication,Transparency in organizational communication builds _____.,Internal confusion,Employee resistance,Competitive disadvantage,Trust and accountability across the organization,D
High School,Business Communication,Which practice most effectively strengthens professional writing quality?,Overusing industry jargon,Ignoring grammatical conventions,Writing excessively long sentences,"Using clear structure, active voice, and thorough proofreading",D
High School,Business Communication,The purpose of communication ethics is to _____.,Maximize profit margins,Limit dialogue opportunities,Control staff behavior,"Promote honesty, accountability, and responsible messaging",D
High School,Business Communication,Which tool is most effective for remote team collaboration?,Paper interoffice memos only,Fax machine transmissions,Printed reports distributed by mail,Shared cloud-based documents and collaboration platforms,D
High School,Business Communication,Message framing refers to _____.,Choosing the margin size for a document,Adding decorative graphics,Increasing word count,How information is presented to shape audience interpretation,D
High School,Business Communication,Why is feedback important in business presentations?,It primarily increases the time of the presentation,It serves only to delay the conclusion,It adds humor to the event,It helps the presenter gauge audience understanding,D
High School,Business Communication,Which approach most reduces miscommunication in professional settings?,Assuming shared understanding,Communicating as quickly as possible,Using heavy slang and abbreviations,Clarifying expectations and confirming understanding,D
High School,Business Communication,Professionalism in communication includes _____.,Using informal slang freely,Ignoring project deadlines,Putting in minimal effort,"Respectful tone, proper grammar, and timely responses",D
High School,Business Communication,An example of external business communication is _____.,An internal department memo,A team meeting agenda,A staff performance evaluation,A company newsletter sent to customers,C
High School,Business Communication,Strategic communication ensures messages _____.,Are random and spontaneous,Are only sent via email,Focus on entertainment,Are planned and aligned with organizational goals,D
High School,Business Communication,Which factor most effectively improves cross-generational communication?,Stereotyping different age groups,Relying solely on one communication medium,Ignoring audience feedback,Adapting communication style to fit diverse generational preferences,D
High School,Business Law,Statutory law is law that is _____.,Created by court decisions,Passed by legislative bodies,Based solely on social customs,Derived from international treaties,B
High School,Business Law,Common law is primarily derived from _____.,Judicial decisions and court precedents,Constitutional text only,Administrative agency regulations,Presidential executive orders,A
High School,Business Law,Which element is required to form a valid contract?,A written signature always,Mutual assent (offer and acceptance),A witness signature,A corporate seal,B
High School,Business Law,Consideration in contract law refers to _____.,A polite gesture,Something of legal value exchanged by both parties,A government-issued permit,A required written clause,B
High School,Business Law,Which court is the highest judicial authority in the United States?,U.S. Circuit Court of Appeals,U.S. Supreme Court,U.S. District Court,U.S. Tax Court,B
High School,Business Law,A tort is best defined as a _____.,Type of criminal statute,Business operating license,Civil wrong that causes harm,Tax regulation,C
High School,Business Law,Negligence is defined as _____.,Intentional deceptive conduct,Reasonable and careful behavior,The failure to exercise reasonable care that a prudent person would,Signing a contract under duress,C
High School,Business Law,The Federal Trade Commission (FTC) primarily regulates _____.,Workplace safety standards,Immigration policy,Consumer protection and unfair business practices,National defense,C
High School,Business Law,Criminal law primarily governs _____.,Private disputes between individuals,Administrative agency rules,Contract performance issues,Offenses against society punishable by the state,D
High School,Business Law,A breach of contract occurs when _____.,A party successfully negotiates better terms,Amendments are added by agreement,A renewal is signed,A party fails to perform a contractual obligation,D
High School,Business Law,Defamation is defined as _____.,A false statement that harms another's reputation,A valid written agreement,A legal appeal process,An insurance claim filing,A
High School,Business Law,Which constitutional amendment protects against self-incrimination?,First Amendment,Fourth Amendment,Fifth Amendment,Tenth Amendment,C
High School,Business Law,Intellectual property refers to _____.,Physical office equipment and assets,Legal rights over creative works and inventions,Corporate tax return filings,Company-owned vehicles,B
High School,Business Law,Bankruptcy is a legal process for _____.,Merging two companies,Registering new patents,Debt relief and restructuring,Dissolving a contract,C
High School,Business Law,"Which law prohibits employment discrimination based on race, sex, and religion?",Sherman Antitrust Act,Civil Rights Act of 1964,Uniform Commercial Code,USA PATRIOT Act,B
High School,Business Law,A subpoena is _____.,A court order to appear or produce evidence,A type of tax bill,A corporate charter document,An employment contract,A
High School,Business Law,Which business structure provides owners with limited personal liability?,Sole proprietorship,General partnership,Limited Liability Company (LLC),Nonprofit association,C
High School,Business Law,Arbitration is a form of _____.,Trial by jury,Only informal negotiation,Standard government regulation,Private alternative dispute resolution,D
High School,Business Law,Which federal agency regulates the securities markets?,EPA,Department of Labor,Securities and Exchange Commission (SEC),IRS,C
High School,Business Law,Fraud is defined as _____.,Intentional deception for personal gain,An honest accounting oversight,A legal contract amendment,A government audit process,A
High School,Business Law,The Uniform Commercial Code (UCC) primarily governs _____.,Federal criminal prosecutions,Commercial transactions between parties,International trade treaties,Federal tax enforcement,B
High School,Business Law,Strict liability holds a party responsible _____.,Only for negligent actions,Regardless of fault or intent,Only after a jury trial,Only after filing an appeal,A
High School,Business Law,An implied contract is an agreement _____.,Always written and formally signed,Only enforceable if verbal,Inferred from the parties' conduct and circumstances,Outlined in a corporate charter,C
High School,Business Law,The Sherman Antitrust Act is designed to address _____.,Employer disability accommodations,Family and medical leave rights,Monopolies and restraints of trade,Required financial disclosures,C
High School,Business Law,Vicarious liability holds an employer responsible for _____.,Only their own independent acts,Their employees' actions performed within the scope of employment,Tax reporting compliance,Corporate merger activity,B
High School,Business Law,Fiduciary duty requires _____.,A duty to compete aggressively,A duty of loyalty and care toward another party,Only a tax reporting obligation,An environmental regulation requirement,B
High School,Business Law,Due process guarantees _____.,Automatic conviction of defendants,Corporate dissolution rights,Administrative fines,Fair legal procedures before deprivation of rights,D
High School,Business Law,Trade secrets are primarily protected by _____.,Copyright law,Patent law,Trademark registration,The Uniform Trade Secrets Act,D
High School,Business Law,An injunction is _____.,A type of monetary damages award,A court order directing a party to do or stop doing an act,A tax refund mechanism,A settlement agreement,B
High School,Business Law,Proximate cause in tort law refers to _____.,A distant and unrelated cause,The direct legal cause that produces harm,A financial motive for wrongdoing,An insurance policy exclusion clause,B
High School,Business Law,The legal doctrine of stare decisis requires courts to _____.,Override prior decisions freely,Follow established judicial precedent,Exercise executive privilege,Create administrative rules independently,B
High School,Business Law,Piercing the corporate veil allows courts to _____.,Expand shareholder voting rights,Hold individual owners personally liable for corporate debts,Issue new corporate stock,Increase dividend distributions,B
High School,Business Law,Which constitutional amendment protects citizens against unreasonable searches?,Second Amendment,Third Amendment,Fourth Amendment,Sixth Amendment,C
High School,Business Law,A hostile work environment exists when _____.,The office is physically competitive,The building lacks proper maintenance,Unwelcome conduct unreasonably interferes with an employee's work,Supervision is strict but lawful,C
High School,Business Law,Contributory negligence means _____.,The plaintiff was partially at fault for their own injury,Only the defendant acted intentionally,There is absolute liability involved,A regulatory rule was violated,A
High School,Business Law,A derivative lawsuit is brought _____.,By a shareholder on behalf of the corporation,As a criminal prosecution,As an employment discrimination claim,To protect a patent filing,A
High School,Business Law,Judicial review allows courts to _____.,Override executive privilege claims,Grant legislative immunity,Issue corporate immunity,Review and invalidate unconstitutional government actions,D
High School,Business Law,Material misrepresentation involves _____.,A minor typographical error,A significant false statement that influences a party's decision,A delayed shipment notice,A casual verbal compliment,B
High School,Business Law,The Americans with Disabilities Act (ADA) prohibits _____.,Tax evasion schemes,Insider trading activities,Disability-based discrimination in employment and public accommodations,Monopoly pricing practices,C
High School,Business Law,A forum selection clause in a contract _____.,Specifies which court or jurisdiction will resolve disputes,Sets an insurance premium,Grants a stock option,Initiates a trademark filing,A
High School,Business Law,Indemnification in a contract means _____.,Compensation for a loss or damage suffered,A tax exemption grant,A loan refinancing arrangement,A patent term extension,A
High School,Business Law,The business judgment rule protects corporate directors who _____.,Act in good faith and make informed decisions,Always maximize short-term profit,Force dividend distributions,Eliminate all fiduciary duties,A
High School,Business Law,Res judicata prevents _____.,Delays in case scheduling,Re-litigation of a matter already finally decided,Court scheduling conflicts,A contract from being renewed,B
High School,Business Law,A class action lawsuit is filed _____.,By an individual in a criminal trial,To appeal to the Supreme Court,At a regulatory hearing,By a group of plaintiffs with substantially similar claims,D
High School,Business Law,The California Consumer Privacy Act (CCPA) primarily regulates _____.,HIPAA medical records,Children's online privacy (COPPA),Consumer data privacy rights for California residents,Sarbanes-Oxley financial disclosures,C
High School,Business Law,Anticipatory repudiation occurs when _____.,A party fully performs in advance,One party communicates intent to breach before performance is due,A contract is formally renewed,Parties reach a final settlement,B
High School,Business Law,Mens rea in criminal law refers to _____.,The guilty mental intent required for a crime,A type of civil damages award,A corporate tax obligation,An administrative law appeal,A
High School,Business Law,Strict scrutiny is the _____ level of judicial review.,Lowest constitutional,Intermediate-level constitutional,Highest constitutional standard applied to fundamental rights,An administrative audit standard,C
High School,Business Law,Liquidated damages in a contract are _____.,Punitive damages awarded by a jury,Estimated damages agreed to in advance in the contract,Emotional distress damages,Nominal damages,B
High School,Business Law,Unconscionability in contract law refers to _____.,A contract with an extremely high profit margin,A corporate merger agreement,A trademark dispute filing,Contract terms so unfair they shock the conscience of the court,D
High School,Computer Problem Solving,An algorithm is best described as _____.,A type of computer hardware component,A virus protection tool,A step-by-step procedure to solve a problem,A database table structure,C
High School,Computer Problem Solving,Which data type is used to store whole numbers?,String,Boolean,Integer,Float,C
High School,Computer Problem Solving,What does CPU stand for?,Computer Power Utility,Central Program Utility,Control Processing Unit,Central Processing Unit,D
High School,Computer Problem Solving,"In programming, which symbol is most commonly used for variable assignment?",==,!=,&&,= (single equals sign),D
High School,Computer Problem Solving,Debugging refers to _____.,Writing entirely new code from scratch,Permanently deleting files,Upgrading computer hardware,Finding and fixing errors in code,D
High School,Computer Problem Solving,Which control structure repeats code while a condition is true?,If statement,Function definition,Variable declaration,While loop,D
High School,Computer Problem Solving,A variable in programming is _____.,A fixed constant value,A loop control structure,A hardware input device,A named storage location for data,D
High School,Computer Problem Solving,Which of the following is a high-level programming language?,HTTP,USB,HTML,Python,D
High School,Computer Problem Solving,RAM (Random Access Memory) is used to store _____.,Permanent long-term data,BIOS configuration settings,Archived data backups,Temporary data currently in use by the processor,D
High School,Computer Problem Solving,Which operator is used in most languages to test equality between two values?,== (double equals),= (single equals),+=,++,A
High School,Computer Problem Solving,Pseudocode is best described as _____.,Binary executable code,An encrypted network message,Compiled program output,A human-readable description of an algorithm's steps,D
High School,Computer Problem Solving,Which of the following is an example of an input device?,Monitor,Printer,Speaker,Keyboard,D
High School,Computer Problem Solving,IDE stands for _____.,Internet Data Engine,Internal Data Exchange,Independent Design Editor,Integrated Development Environment,D
High School,Computer Problem Solving,Which file extension is commonly associated with Python source files?,.exe,.html,.py,.docx,C
High School,Computer Problem Solving,A loop in programming is used to _____.,Declare variables,End program execution,Encrypt user data,Repeat a block of instructions,D
High School,Computer Problem Solving,"In Boolean logic, which value represents TRUE?",0,-1,False,True,D
High School,Computer Problem Solving,Output in computing refers to _____.,Raw unprocessed input data,The original source code,Memory address locations,Data or results produced by a program,D
High School,Computer Problem Solving,A conditional statement in programming is used to _____.,Repeat instructions in a loop,Speed up program compilation,Encrypt data securely,Make decisions based on conditions,D
High School,Computer Problem Solving,A syntax error in programming is _____.,A hardware component failure,A network connectivity outage,Slow processing performance,A violation of the programming language's grammar rules,D
High School,Computer Problem Solving,Which computer component provides long-term data storage?,RAM (Random Access Memory),CPU Cache,Central Processing Unit,Hard Drive or SSD,D
High School,Computer Problem Solving,Time complexity in algorithms measures _____.,Clock speed of the CPU,Available internet bandwidth,The size of memory installed,How algorithm execution time grows relative to input size,D
High School,Computer Problem Solving,"Which data structure operates on a Last-In, First-Out (LIFO) basis?",Queue,Stack,Array,Tree,B
High School,Computer Problem Solving,An API (Application Programming Interface) is _____.,An advanced program instruction set,An automated processing index,An applied protocol for the internet,A set of rules allowing software components to communicate,D
High School,Computer Problem Solving,SQL is primarily used to _____.,Render graphics,Manage and query relational databases,Train machine learning models,Administer operating systems,B
High School,Computer Problem Solving,Recursion in programming refers to _____.,A loop with a fixed number of iterations,Parallel multi-core processing,Swapping data between memory and disk,A function that calls itself within its own definition,D
High School,Computer Problem Solving,Which search algorithm examines each element sequentially from the start?,Binary search,Hash-based search,Linear search,Tree search,C
High School,Computer Problem Solving,A compiler is a program that _____.,Serves as a text editor,Monitors hardware performance,Manages a database,Translates source code into machine-executable code,D
High School,Computer Problem Solving,Which data structure stores data as key-value pairs?,Array,Stack,Dictionary (or Hash Map),Queue,C
High School,Computer Problem Solving,Version control systems like Git are used for _____.,Increasing CPU speed,Encrypting user passwords,Replacing hardware components,Tracking and managing changes to source code,D
High School,Computer Problem Solving,Big-O notation is used to describe _____.,Encryption strength of an algorithm,Algorithm time and space efficiency,The design of user interfaces,Color themes in applications,B
High School,Computer Problem Solving,Polymorphism in object-oriented programming (OOP) is _____.,The use of single inheritance only,Multiple nested loops in code,Data compression techniques,The ability of different objects to respond to the same interface,D
High School,Computer Problem Solving,A deadlock in computing occurs when _____.,The system is running at peak efficiency,A security certificate has expired,Processes wait indefinitely for each other's resources,Cache memory is fully optimized,C
High School,Computer Problem Solving,Which sorting algorithm has an average time complexity of O(n log n)?,Bubble Sort,Merge Sort,Linear search sort,Selection Sort,B
High School,Computer Problem Solving,A hash function maps input data to _____.,A fixed-size output value (hash),Only an encryption key,A loop condition,A graphics rendering process,A
High School,Computer Problem Solving,Database normalization is the process of _____.,Encrypting all database records,Increasing redundant data,Reducing redundancy and improving data integrity in databases,Expanding database file sizes,C
High School,Computer Problem Solving,REST in web services stands for _____.,Remote Execution Standard Tool,Representational State Transfer,Real-time Encryption Secure Transfer,Randomized External System Transport,B
High School,Computer Problem Solving,A race condition occurs when _____.,A program renders colors incorrectly,The network exceeds its bandwidth limit,Hardware components overheat,Program behavior depends on unpredictable timing of concurrent threads,D
High School,Computer Problem Solving,Which protocol is used to secure HTTPS web communication?,HTTP,FTP,SMTP,TLS (Transport Layer Security),D
High School,Computer Problem Solving,Machine learning differs from traditional programming because it _____.,Only uses manual coding,Indexes database records,Routes network packets,Learns patterns from data without explicit programming,D
High School,Computer Problem Solving,Which data structure organizes data in a hierarchical parent-child relationship?,Tree,Stack,Queue,Array,A
High School,Computer Problem Solving,Encryption is the process of _____.,Permanently deleting sensitive files,Compressing image files,Formatting a storage disk,"Converting data into a coded, unreadable format",D
High School,Computer Problem Solving,A distributed system is a collection of _____.,A single monolithic computer,An isolated mainframe,Multiple computers that work together and appear as one,Only local storage devices,C
High School,Computer Problem Solving,Dijkstra's algorithm is used to find _____.,Depth-first search order,Breadth-first traversal,The shortest path in a weighted graph,An efficient insertion sort,C
High School,Computer Problem Solving,Containerization in software development involves _____.,A hardware virtualization technique,An operating system kernel replacement,Packaging an application and its dependencies into a portable container,Manual software installation steps,C
High School,Computer Problem Solving,A zero-day vulnerability is _____.,A security flaw that has been fully patched,A vulnerability in an expired software license,A known and documented network delay issue,"An unknown, unpatched security flaw being actively exploited",D
High School,Computer Problem Solving,"In cloud computing, IaaS refers to _____.",Software as a Service,Platform as a Service,Infrastructure as a Service,On-premises dedicated servers,C
High School,Computer Problem Solving,Concurrency in computing refers to _____.,Sequential single-task execution,Single-threaded linear processing,Manual task scheduling by an operator,Multiple tasks making progress within the same time period,D
High School,Computer Problem Solving,NoSQL databases are best suited for _____.,"Only rigid, structured relational data schemas",Spreadsheet-style data editing,Static HTML web pages,Unstructured or semi-structured large-scale data,D
High School,Computer Problem Solving,Latency in networking refers to _____.,The total data storage capacity,The user interface theme,The file size of transmitted data,The delay between initiating a request and receiving a response,D
High School,Computer Problem Solving,Continuous integration (CI) in software development involves _____.,Manual code testing only,Only annual software updates,Complete hardware replacement,Automatically testing and merging code changes frequently,D
High School,Cybersecurity,Cybersecurity is best defined as _____.,Repairing damaged computer hardware,Designing and building websites,Increasing internet connection speed,"Protecting systems, networks, and data from digital attacks",D
High School,Cybersecurity,Malware is _____.,A type of cloud storage service,A standard email attachment format,A firewall configuration rule,Malicious software designed to harm or exploit systems,D
High School,Cybersecurity,Which is an example of a strong password practice?,Using your birth date as a password,Reusing the same password across all accounts,Using the password '123456',"Using a long, unique passphrase with mixed characters",D
High School,Cybersecurity,Phishing attacks attempt to _____.,Speed up internet connection,Improve antivirus databases,Back up system files,Trick users into revealing sensitive information,D
High School,Cybersecurity,Which network device filters incoming and outgoing traffic based on rules?,Monitor,Keyboard,Router,Firewall,D
High School,Cybersecurity,VPN stands for _____.,Verified Public Node,Variable Protocol Network,Virtual Protected Node,Virtual Private Network,D
High School,Cybersecurity,Two-factor authentication (2FA) requires _____.,A single password only,Only a backup password,A security question alone,Two forms of verification to confirm identity,D
High School,Cybersecurity,Ransomware is malware that _____.,Provides free antivirus alerts,Increases internet speed,Triggers automatic system updates,Encrypts a victim's files and demands payment for the key,D
High School,Cybersecurity,A firewall is a system that _____.,Improves grammar in documents,Provides cloud data storage,Encrypts all user emails,Monitors and controls incoming/outgoing network traffic,D
High School,Cybersecurity,Which practice most effectively improves account security?,Sharing your password with trusted colleagues,Disabling security updates,Using public Wi-Fi for sensitive logins,Enabling multi-factor authentication (MFA),D
High School,Cybersecurity,Social engineering attacks exploit _____.,Only network hardware,Encryption protocols,Operating system vulnerabilities,Human psychology and trust to gain unauthorized access,D
High School,Cybersecurity,Antivirus software is designed to _____.,Create new forms of malware,Block all internet access,Increase available RAM,"Detect, prevent, and remove malicious software",D
High School,Cybersecurity,Encryption in cybersecurity refers to _____.,Permanently deleting all files,Creating system backups,Reformatting storage drives,Converting data into a coded format to prevent unauthorized access,D
High School,Cybersecurity,Which protocol secures data transmission over the web?,HTTP,FTP,SMTP,HTTPS,D
High School,Cybersecurity,A data breach occurs when _____.,Data is intentionally shared with partners,A scheduled data backup is created,Authorized users access a system,Sensitive data is accessed or exposed without authorization,D
High School,Cybersecurity,Spyware is software that _____.,Is a legitimate cloud storage service,Is a type of operating system update,Acts as a hardware device driver,Secretly monitors a user's activity and collects data,D
High School,Cybersecurity,Which U.S. agency leads national cybersecurity efforts for critical infrastructure?,SEC,OSHA,FTC,CISA (Cybersecurity and Infrastructure Security Agency),D
High School,Cybersecurity,Which behavior is safest when using public Wi-Fi?,Accessing your online bank account,Disabling your device's firewall,Sharing files freely on the network,Using a VPN to encrypt your connection,D
High School,Cybersecurity,Patching a software vulnerability means _____.,Ignoring the known security weakness,Removing the affected application permanently,Changing all user passwords,Installing an update that fixes the security flaw,D
High School,Cybersecurity,A brute-force attack involves _____.,Physically stealing computer hardware,Installing antivirus software,Backing up all user data,Systematically trying all possible passwords until the correct one is found,D
High School,Cybersecurity,The CIA triad in cybersecurity stands for _____.,Cyber Internet Access,"Control, Inspection, and Authorization",Centralized Internet Architecture,"Confidentiality, Integrity, and Availability",D
High School,Cybersecurity,A Distributed Denial of Service (DDoS) attack works by _____.,Targeting only individual users,Installing spyware silently,Using phishing emails,Flooding a server with traffic to make it unavailable,D
High School,Cybersecurity,Multi-factor authentication (MFA) combines _____.,Only a username and single password,Only two security questions,Only IP address filtering,Two or more different types of authentication factors,D
High School,Cybersecurity,A vulnerability scan is an automated process that _____.,Tests overall system performance,Backs up all system data,Encrypts all network communications,Identifies security weaknesses in systems and applications,D
High School,Cybersecurity,The principle of least privilege means _____.,All users receive maximum access rights,Admin credentials are shared widely,No password policy is enforced,Users are granted only the minimum access needed for their role,D
High School,Cybersecurity,SQL injection is a cyberattack that _____.,Only affects hardware components,Is a firewall rule type,Is used for performance tuning,Inserts malicious code into database queries to manipulate data,D
High School,Cybersecurity,Endpoint security focuses on _____.,Only monitoring stock prices,Managing cloud pricing models,Running email marketing campaigns,Securing individual devices that connect to a network,A
High School,Cybersecurity,Hashing in cybersecurity is commonly used for _____.,Reversibly encrypting data,Routing network packets,Increasing processing speed,Securely storing passwords as fixed-length representations,D
High School,Cybersecurity,A zero-day exploit targets _____.,An expired software license,A previously patched vulnerability,A known and resolved security issue,"An unknown, unpatched vulnerability before a fix is available",D
High School,Cybersecurity,ISO 27001 is an international standard related to _____.,Environmental management systems,Product quality control,Manufacturing compliance,Information security management systems (ISMS),D
High School,Cybersecurity,Defense in depth is a cybersecurity strategy that uses _____.,Only a single firewall layer,Public data sharing policies,Password removal,Multiple overlapping layers of security controls,D
High School,Cybersecurity,A SIEM (Security Information and Event Management) system is used to _____.,Serve as a Software Installation Engine,Act as a Secure Internal Encryption Mechanism,Function as a System Internet Email Module,Collect and analyze security events in real time for threat detection,D
High School,Cybersecurity,Lateral movement in a cyberattack refers to _____.,The process of user authentication,The method of encrypting network traffic,The migration of a company to cloud services,An attacker moving through a network after initial compromise,D
High School,Cybersecurity,A man-in-the-middle (MITM) attack involves _____.,Remotely deleting files from a server,Conducting a mass phishing campaign,Exploiting poor password reuse habits,Secretly intercepting communications between two parties,D
High School,Cybersecurity,Threat modeling is the process of _____.,Running routine system backups,Updating hardware firmware,Installing a new operating system,"Identifying, analyzing, and mitigating potential security threats",D
High School,Cybersecurity,Sandboxing in cybersecurity involves _____.,Using a cloud storage method,Resetting user passwords,Implementing a company security policy,Running untrusted code in an isolated environment for analysis,D
High School,Cybersecurity,The NIST Cybersecurity Framework provides guidance for _____.,U.S. Generally Accepted Accounting Principles,FCC telecommunications regulations,ISO 9001 quality management,Managing and reducing cybersecurity risk across organizations,D
High School,Cybersecurity,Data exfiltration refers to _____.,Rebooting a compromised server,Encrypting data for secure storage,Hashing passwords for storage,Unauthorized transfer of data out of an organization,D
High School,Cybersecurity,Biometric authentication uses _____.,Only a username and single password,IP address filtering rules,Email-based verification codes,Physical characteristics like fingerprints or facial recognition,D
High School,Cybersecurity,A botnet is _____.,A secure corporate email server,A hardware-based firewall device,A password management application,A network of compromised devices controlled by a threat actor,D
High School,Cybersecurity,TLS (Transport Layer Security) is used to _____.,Permanently delete malware files,Create system data backups,Install updated device drivers,Encrypt data transmitted over a network,D
High School,Cybersecurity,Risk assessment in cybersecurity involves _____.,Resetting all user passwords,Deleting outdated system logs,Upgrading outdated software applications,"Identifying, evaluating, and prioritizing security risks",D
High School,Cybersecurity,Spear phishing differs from general phishing because it is _____.,A type of mass spam email,An automated firewall rule,A hardware-based intrusion technique,A highly targeted attack customized for a specific individual or organization,D
High School,Cybersecurity,Red teaming in cybersecurity refers to _____.,A standard internal compliance audit,A routine password change policy,A software upgrade process,Authorized simulated attacks to test and improve defenses,D
High School,Cybersecurity,An incident response plan is _____.,A standard marketing communications strategy,A financial reporting framework,A hardware replacement schedule,"A documented procedure for detecting, containing, and recovering from breaches",D
High School,Cybersecurity,Identity and Access Management (IAM) is _____.,A type of cloud storage pricing,A hardware-based firewall system,An operating system component,A framework for managing digital identities and controlling resource access,D
High School,Cybersecurity,Tokenization protects sensitive data by _____.,Encrypting and then deleting the original,Routing it through a proxy server,Logging all access requests,Replacing sensitive values with non-sensitive tokens,D
High School,Cybersecurity,Cyber resilience refers to an organization's _____.,Goal to prevent 100% of all cyberattacks,Strategy to block all internet traffic,Policy to eliminate all system backups,"Ability to withstand, adapt to, and recover from cyber incidents",D
High School,Cybersecurity,Data minimization as a privacy principle means _____.,Storing all collected data indefinitely,Sharing all data with authorized partners,Duplicating all backups for redundancy,Collecting only the minimum amount of personal data necessary,D
High School,Cybersecurity,Penetration testing is _____.,A routine software update procedure,A method for changing password policies,A standard database migration process,An authorized simulated cyberattack to identify security vulnerabilities,D
High School,Data Science & AI,Data science is best described as _____.,Computer hardware repair and maintenance,Designing visual websites,Preparing corporate tax returns,Extracting insights and knowledge from structured and unstructured data,D
High School,Data Science & AI,Artificial intelligence (AI) refers to _____.,Natural human cognitive ability only,Manual data entry processes,Formatting spreadsheets,The simulation of human intelligence processes by computer systems,D
High School,Data Science & AI,Structured data is best described as _____.,Freeform unorganized text,A random audio recording,An unedited image file,Data organized in a predefined format such as a relational database,D
High School,Data Science & AI,CSV stands for _____.,Computer Stored Value,Central System Variable,Cloud Storage Version,Comma-Separated Values,D
High School,Data Science & AI,Which programming language is most widely used in data science?,HTML,PowerPoint macros,FTP commands,Python,D
High School,Data Science & AI,A dataset is _____.,A single numerical value,A type of computer virus,An encryption key,A structured collection of related data points,D
High School,Data Science & AI,Machine learning is _____.,A set of manually written programming rules,A database storage methodology,A type of hardware firewall,A method by which computers learn patterns from data,D
High School,Data Science & AI,"In machine learning, a model is _____.",A physical robot or machine,A spreadsheet template,A type of cloud server,A mathematical representation that makes predictions based on data,D
High School,Data Science & AI,Data visualization refers to _____.,Permanently deleting raw datasets,Encrypting sensitive databases,Increasing database storage capacity,The graphical representation of data to identify patterns and insights,D
High School,Data Science & AI,Which is a common Python library used for data visualization?,Notepad,Bluetooth driver,BIOS firmware,Matplotlib,D
High School,Data Science & AI,Training data is used to _____.,Back up storage systems only,Generate random noise,Create final analytical reports,Teach and develop a machine learning model,D
High School,Data Science & AI,Testing data is used to _____.,Train the machine learning model,Delete outdated records,Increase data storage,Evaluate the performance of a trained model on unseen data,D
High School,Data Science & AI,An algorithm in data science is _____.,A random guess or estimate,A hardware processing chip,A database management query,A set of step-by-step instructions for solving a problem,D
High School,Data Science & AI,Bias in an AI model refers to _____.,A perfectly neutral and unbiased dataset,A random sampling technique,An effective data analysis method,Systematic errors in model output due to flawed data or design,D
High School,Data Science & AI,"Big data is characterized by high volume, high velocity, and _____.",Limited data diversity,Only manual spreadsheets,Restricted data storage,High variety of data types,D
High School,Data Science & AI,Deep learning is a subset of machine learning that uses _____.,Tax auditing processes,Web hosting services,Standard word processing tools,Artificial neural networks with many layers,D
High School,Data Science & AI,A feature in machine learning is _____.,The final output result only,A hardware device driver,A database index key,An individual measurable input variable used by the model,D
High School,Data Science & AI,Supervised learning involves training a model using _____.,Only unlabeled data,Manual coding only,Cloud backup systems,Labeled input-output pairs,D
High School,Data Science & AI,Unsupervised learning trains a model using _____.,Labeled training examples,Hardware encryption,Spreadsheet sorting,Data without predefined labels or correct answers,D
High School,Data Science & AI,AI ethics is primarily concerned with _____.,Maximizing raw processing speed only,Reducing data storage costs,Increasing computation performance,Ensuring AI systems are developed and used responsibly and fairly,D
High School,Data Science & AI,Overfitting in machine learning means a model _____.,Performs poorly even on training data,Is corrupted in the database,Suffers from hardware failure,Memorizes training data and fails to generalize to new data,D
High School,Data Science & AI,Cross-validation is a technique used to _____.,Delete duplicate records,Encrypt all datasets,Label all training examples,Assess model reliability by testing on multiple data splits,D
High School,Data Science & AI,Regression in machine learning is used to predict _____.,Only categorical class labels,Rendered 3D images,Encrypted binary data,Continuous numerical values,D
High School,Data Science & AI,Classification in machine learning predicts _____.,Exact future prices,Only continuous numerical values,Encrypted data sequences,Categorical class labels for input data,D
High School,Data Science & AI,Clustering is an unsupervised technique used to _____.,Sort data only alphabetically,Manually label all records,Compress all dataset files,Group similar data points together without predefined labels,D
High School,Data Science & AI,A confusion matrix is an evaluation tool that shows _____.,A type of data encryption grid,A set of compressed data files,A network topology diagram,Classification model performance including true/false positives and negatives,D
High School,Data Science & AI,Precision in machine learning measures _____.,Total processing speed,The size of the dataset,The model training duration,The proportion of true positives among all predicted positives,D
High School,Data Science & AI,Recall (sensitivity) in machine learning measures _____.,The ability to store large datasets,The encryption strength of a model,The speed of data processing,The proportion of actual positives correctly identified by the model,D
High School,Data Science & AI,An artificial neural network is inspired by _____.,A standard relational database schema,Corporate tax form structures,Cloud storage architecture,The structure and function of the human brain,D
High School,Data Science & AI,Natural Language Processing (NLP) enables AI to _____.,Design hardware components,Format spreadsheet data,Manage cloud file systems,"Understand, interpret, and generate human language",D
High School,Data Science & AI,Gradient descent is an optimization algorithm used to _____.,Encrypt and protect model outputs,Accelerate hardware processing,Store and retrieve training datasets,Minimize the loss function during model training,D
High School,Data Science & AI,A loss function in machine learning measures _____.,A cybersecurity breach event,A cloud service pricing tier,A database file storage format,The difference between predicted and actual values (model error),D
High School,Data Science & AI,Reinforcement learning trains an agent through _____.,Only manual human labeling,Only standard database indexing,Only encryption protocols,Rewards and penalties based on actions in an environment,D
High School,Data Science & AI,Model interpretability refers to _____.,Increasing model file size,Encrypting model outputs,Improving network bandwidth,The degree to which humans can understand how a model makes decisions,D
High School,Data Science & AI,Algorithmic fairness in AI ensures _____.,Maximizing company profit,Increasing raw processing speed,Reducing the number of features used,Equitable treatment across demographic groups in model outputs,D
High School,Data Science & AI,Explainable AI (XAI) focuses on _____.,Maximizing data storage capacity,Encrypting all training datasets,Hosting AI in cloud infrastructure,Making AI decision-making processes transparent and understandable,D
High School,Data Science & AI,Transfer learning involves _____.,Physically moving servers to a new location,Changing database schema structures,Duplicating cloud storage buckets,Reusing a pre-trained model as a starting point for a new related task,D
High School,Data Science & AI,A large language model (LLM) is _____.,A small relational database table,A simple hardware firewall component,A standard spreadsheet macro tool,An AI model trained on massive text datasets to understand and generate language,D
High School,Data Science & AI,Data governance refers to _____.,Deleting outdated server logs,Compressing archive files,Overclocking CPU performance,"Managing data availability, usability, integrity, security, and compliance",D
High School,Data Science & AI,Synthetic data is _____.,Real production data that is anonymized,Stolen data from a breach,A type of encrypted backup file,Artificially generated data used to train models when real data is limited,D
High School,Data Science & AI,Hyperparameter tuning involves _____.,Deleting unused model features,Encrypting all model parameters,Formatting the training dataset,Optimizing configuration settings to improve model performance,D
High School,Data Science & AI,Edge AI refers to _____.,Running AI exclusively in centralized cloud servers,Only using AI in data centers,Processing AI tasks only in mainframe computers,Running AI inference directly on local devices near the data source,D
High School,Data Science & AI,An adversarial attack on an AI model involves _____.,Only hardware malfunctions,Standard database deletion,Normal software maintenance,Deliberately crafted inputs designed to fool or mislead the model,D
High School,Data Science & AI,Federated learning is _____.,Training a model on a single centralized computer,Manual data coding by multiple teams,Deleting distributed data records,Training models across decentralized devices without sharing raw data,D
High School,Data Science & AI,The ROC (Receiver Operating Characteristic) curve is used to _____.,Visualize data encryption strength,Scale model features effectively,Route network traffic,Evaluate binary classification model performance across thresholds,D
High School,Data Science & AI,Dimensionality reduction techniques are used to _____.,Increase the number of input features,Encrypt the training dataset,Format the database records,Reduce the number of input variables while preserving key information,D
High School,Data Science & AI,Anomaly detection in data science is used to _____.,Delete duplicate records from databases,Compress large files for storage,Manually label all training examples,Identify unusual patterns or outliers that deviate from the norm,D
High School,Data Science & AI,Data drift occurs when _____.,A model's weights are manually reset,Encryption fails on a dataset,A server crashes unexpectedly,The statistical distribution of input data changes over time post-deployment,D
High School,Data Science & AI,Model deployment refers to _____.,Deleting the trained model after use,Encrypting the model for security,Archiving training datasets permanently,Making a trained model available in a production environment for use,D
High School,Data Science & AI,The NIST AI Risk Management Framework is designed to _____.,Increase hardware processing speeds,Reduce cloud storage operating costs,Upgrade outdated data center equipment,"Help organizations identify, assess, and manage risks associated with AI systems",D
High School,Economics,Economics is the study of _____.,Weather and climate patterns,Computer programming principles,Medical research and treatments,How societies allocate scarce resources to satisfy unlimited wants,D
High School,Economics,Scarcity in economics means _____.,Resources are unlimited,There is too little money,Governments control all prices,Limited resources relative to unlimited human wants,D
High School,Economics,Opportunity cost is _____.,The total money spent on a product,The tax paid on income,A type of bank interest rate,The value of the next best alternative given up when making a choice,D
High School,Economics,Demand refers to _____.,The quantity sellers are willing to offer,A government price control mechanism,Import quota restrictions,The quantity of a good buyers are willing and able to purchase at various prices,D
High School,Economics,Supply refers to _____.,The quantity buyers demand,A type of government subsidy,A form of tax revenue,The quantity of a good producers are willing and able to offer at various prices,D
High School,Economics,Inflation is best defined as _____.,A decrease in the general price level,An increase in the unemployment rate,A decline in the stock market,A sustained general increase in the price level of goods and services,D
High School,Economics,GDP stands for _____.,Government Debt Percentage,General Deposit Plan,Global Development Policy,Gross Domestic Product,D
High School,Economics,A market economy primarily relies on _____.,Government central planning,A traditional barter system,Command-based resource allocation,Private ownership and market forces of supply and demand,D
High School,Economics,A shortage occurs when _____.,There is excess supply over demand,A price ceiling is removed,Quantity supplied exceeds quantity demanded,Quantity demanded exceeds quantity supplied,D
High School,Economics,A surplus occurs when _____.,High inflation is present,GDP is declining,Unemployment is rising,Quantity supplied exceeds quantity demanded,D
High School,Economics,A price ceiling is a government-set _____.,Minimum legal price,Market equilibrium price,Mandatory import tariff,Maximum legal price for a good or service,D
High School,Economics,A price floor is a government-set _____.,Maximum legal price,Market equilibrium price,Consumer tax rate,Minimum legal price for a good or service,D
High School,Economics,Which institution controls monetary policy in the United States?,The U.S. Congress,The Department of the Treasury,The World Bank,The Federal Reserve System,D
High School,Economics,The unemployment rate measures _____.,Total population size,Number of active businesses,The average interest rate,The percentage of the labor force that is jobless and seeking work,D
High School,Economics,A tariff is _____.,A government subsidy to exporters,A domestic price ceiling,A minimum wage requirement,A tax imposed on imported goods,D
High School,Economics,Specialization in economics refers to _____.,Producing all goods equally,Government central planning,Setting fixed price controls,Focusing resources on producing goods where one has a comparative advantage,D
High School,Economics,A subsidy is _____.,A tax penalty on businesses,A type of import restriction,A form of interest rate control,Government financial assistance provided to a business or consumer,D
High School,Economics,A monopoly exists when _____.,Many firms compete in a market,Two firms share a market equally,Government runs all businesses,A single seller controls the entire market for a product,D
High School,Economics,The Consumer Price Index (CPI) measures _____.,Total national GDP,The current interest rate,The foreign exchange rate,Changes in the average price level of a basket of consumer goods,D
High School,Economics,Entrepreneurship refers to _____.,Working only for government agencies,Managing all national imports,Collecting taxes on behalf of the state,Starting and managing a new business venture while bearing financial risk,D
High School,Economics,Price elasticity of demand measures _____.,Total supply available,The government's spending level,The inflation rate trend,How much quantity demanded responds to a change in price,D
High School,Economics,Which factor shifts the demand curve to the right (increases demand)?,A decrease in consumer income,An increase in the price of the good,An increase in production costs,An increase in consumer income or positive consumer preferences,D
High School,Economics,Fiscal policy refers to _____.,Central bank interest rate decisions,Import quota controls,Stock market trading regulations,Government decisions on taxation and public spending,D
High School,Economics,Marginal cost is _____.,The total fixed cost of production,The average revenue per unit,The opportunity cost of the next choice,The cost of producing one additional unit of output,D
High School,Economics,Comparative advantage means producing at _____.,The highest absolute efficiency,The greatest total output volume,The highest tariff level,A lower opportunity cost than another producer,D
High School,Economics,The Bureau of Economic Analysis (BEA) is known for measuring _____.,Monetary policy and interest rates,International trade agreements,"GDP, national income, and economic accounts",Business law and regulations,C
High School,Economics,Stagflation describes a period of _____.,High growth and low inflation,Only persistently low inflation,High GDP growth alongside low unemployment,High inflation combined with high unemployment and stagnant growth,D
High School,Economics,Monetary tightening involves _____.,Lowering interest rates,Increasing government spending,Reducing income taxes,Raising interest rates to reduce money supply and control inflation,D
High School,Economics,Aggregate demand represents _____.,Only individual consumer demand,Only export-related spending,Only corporate capital investment,Total demand for all goods and services in an economy at a given price level,D
High School,Economics,A recession is commonly defined as _____.,One month of economic decline,Only a stock market downturn,Inflation exceeding 10% for one quarter,Two or more consecutive quarters of negative GDP growth,D
High School,Economics,The Phillips Curve illustrates the relationship between _____.,Supply and demand equilibrium,GDP growth and tariff levels,Import and export ratios,Inflation and unemployment (inverse trade-off),D
High School,Economics,Quantitative easing (QE) involves _____.,The government reducing its spending,A central bank selling bonds to reduce liquidity,Raising income tax rates,A central bank purchasing securities to inject money into the economy,D
High School,Economics,Crowding out occurs when _____.,Exports decrease due to tariffs,Inflation falls below zero,Unemployment rises due to automation,Government borrowing raises interest rates and reduces private investment,D
High School,Economics,Purchasing Power Parity (PPP) theory suggests _____.,Tax rates should equalize globally,Interest rates are controlled by governments,Trade quotas eliminate currency differences,Exchange rates should adjust so that identical goods cost the same across countries,D
High School,Economics,Marginal propensity to consume (MPC) is _____.,The fraction of income saved,The inflation adjustment factor,The rate of unemployment change,The fraction of additional income that a household spends on consumption,D
High School,Economics,A progressive tax system is one where _____.,Everyone pays the same flat rate,The tax rate decreases as income rises,Only businesses pay taxes,The tax rate increases as income increases,D
High School,Economics,The Lorenz Curve is used to illustrate _____.,Interest rate fluctuations,GDP growth trends over time,Consumer price inflation cycles,Income or wealth inequality within a population,D
High School,Economics,Supply-side economics advocates for _____.,Increasing aggregate demand via spending,Reducing all exports,Imposing broad price ceilings,Tax cuts and deregulation to stimulate economic growth through the supply side,D
High School,Economics,A liquidity trap occurs when _____.,Interest rates are rising rapidly,Export volumes are at an all-time high,The currency is extremely strong,Monetary policy becomes ineffective because interest rates are near zero,D
High School,Economics,Human capital refers to _____.,Physical production machinery,Stocks and government bonds,Natural resource reserves,"The skills, education, and experience embodied in the workforce",D
High School,Economics,The Keynesian multiplier effect means _____.,Tax deductions double automatically,Interest rates are self-regulating,Inflation always follows unemployment,An initial change in spending leads to a larger total change in GDP,D
High School,Economics,An externality is _____.,Only a private production cost,A market equilibrium condition,An individual consumer preference,A cost or benefit experienced by third parties not involved in a transaction,D
High School,Economics,A trade deficit occurs when _____.,Exports exceed imports,Trade is perfectly balanced,Import tariffs are very high,Imports exceed exports in value,D
High School,Economics,The International Monetary Fund (IMF) primarily monitors _____.,Corporate profit reporting,Local municipal tax rates,National currency printing levels,Global financial stability and provides support to countries facing balance-of-payments problems,D
High School,Economics,Game theory in economics studies _____.,Predicting inflation only,Analyzing trade barrier impacts,Modeling unemployment rates,Strategic decision-making where outcomes depend on the choices of multiple agents,D
High School,Economics,Structural unemployment results from _____.,Temporary seasonal layoffs,A short-term recessionary downturn,Workers voluntarily quitting jobs,A long-term mismatch between workers' skills and available job requirements,D
High School,Economics,Nominal GDP differs from real GDP because nominal GDP _____.,Excludes government spending,Is calculated only for one sector,Measures only exports,Is not adjusted for inflation,D
High School,Economics,The real interest rate equals _____.,The loan principal amount,The nominal bond face value,The current foreign exchange rate,The nominal interest rate minus the inflation rate,D
High School,Economics,Central bank independence refers to _____.,The government directly controlling all interest rates,A fixed exchange rate system for all currencies,A clause in every trade agreement,The ability of a central bank to make monetary policy decisions free from political interference,D
High School,Economics,Capital formation in economics refers to _____.,The government's total deficit spending,The rise in inflation over time,A country's trade restriction policy,Investment in physical and human capital to increase productive capacity,D
`;

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
