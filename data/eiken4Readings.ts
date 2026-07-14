export type Eiken4ReadingQuestion = {
  question: string;
  choices: string[];
  answer: string;
  evidence: string;
  explanation: string;
};

export type Eiken4Reading = {
  id: string;
  type: string;
  title: string;
  passage: string;
  translation: string;
  questions: Eiken4ReadingQuestion[];
};

export const eiken4Readings: Eiken4Reading[] = [
  { id: 'r001', type: 'メール', title: 'From: Lucy / To: Aya', passage: "Hi Aya, Thank you for inviting me to your birthday party this Saturday. I will come with my sister, Kate. We will take the 10:15 train and arrive at Midori Station at 10:45. Can you meet us there? We are looking forward to seeing you!", translation: 'アヤへ。今週土曜日の誕生日会に招待してくれてありがとう。妹のケイトと一緒に行きます。10時15分の電車に乗り、10時45分にみどり駅に着きます。そこで会えますか。会えるのを楽しみにしています。', questions: [
    { question: 'ルーシーは誰とパーティーへ行きますか？', choices: ['妹', '母', '友達', '一人'], answer: '妹', evidence: 'I will come with my sister, Kate.', explanation: 'with my sisterから、妹と一緒に行くと分かります。' },
    { question: '二人は何時に駅へ着きますか？', choices: ['10時15分', '10時30分', '10時45分', '11時'], answer: '10時45分', evidence: 'arrive at Midori Station at 10:45', explanation: 'arrive atは「〜に到着する」です。' },
  ]},
  { id: 'r002', type: 'お知らせ', title: 'Library Notice', passage: 'The school library will be closed next Monday morning. Teachers will have a meeting there. It will open at one in the afternoon. Students can return books to the box by the library door. Please do not put magazines in the box.', translation: '学校の図書館は次の月曜日の午前中は閉まります。先生たちがそこで会議をします。午後1時に開きます。生徒は図書館のドアのそばの箱へ本を返せます。雑誌は箱へ入れないでください。', questions: [
    { question: '図書館は月曜日の何時に開きますか？', choices: ['午前9時', '正午', '午後1時', '午後3時'], answer: '午後1時', evidence: 'It will open at one in the afternoon.', explanation: 'one in the afternoonは午後1時です。' },
    { question: '箱に入れてはいけないものは何ですか？', choices: ['本', '雑誌', '手紙', 'ノート'], answer: '雑誌', evidence: 'Please do not put magazines in the box.', explanation: 'do not put magazinesが禁止事項です。' },
  ]},
  { id: 'r003', type: '日記', title: "Ken's Sunday", passage: 'Yesterday, I went to the city museum with my father. We wanted to see the new dinosaur show. There were many people, but we did not wait long. My favorite thing was a very large dinosaur egg. I bought a postcard of it for my friend Taro.', translation: '昨日、父と市の博物館へ行きました。新しい恐竜展を見たかったからです。人は多かったですが、長く待ちませんでした。一番気に入ったのは、とても大きな恐竜の卵でした。それの絵はがきを友達の太郎に買いました。', questions: [
    { question: 'ケンは誰と博物館へ行きましたか？', choices: ['父', '母', '太郎', '先生'], answer: '父', evidence: 'I went to the city museum with my father.', explanation: 'with my fatherが一緒に行った人です。' },
    { question: 'ケンが一番気に入ったものは何ですか？', choices: ['恐竜の骨', '恐竜の卵', '絵はがき', '博物館の建物'], answer: '恐竜の卵', evidence: 'My favorite thing was a very large dinosaur egg.', explanation: 'favorite thingの後に答えがあります。' },
  ]},
  { id: 'r004', type: '会話', title: 'After School', passage: "Mika: Are you busy after school, Ben? Ben: I have soccer practice until four thirty. Why? Mika: I need a birthday present for my mother. Can you help me choose one? Ben: Sure. Let's meet in front of the flower shop at five.", translation: 'ミカ：放課後は忙しいですか、ベン。ベン：4時30分までサッカーの練習があります。どうして？ ミカ：母への誕生日プレゼントが必要です。選ぶのを手伝ってくれますか。ベン：もちろん。5時に花屋の前で会いましょう。', questions: [
    { question: 'ミカは誰へのプレゼントを探していますか？', choices: ['母', '父', 'ベン', '先生'], answer: '母', evidence: 'I need a birthday present for my mother.', explanation: 'for my motherから母へのプレゼントだと分かります。' },
    { question: '二人はどこで会いますか？', choices: ['学校の前', '駅', '花屋の前', 'サッカー場'], answer: '花屋の前', evidence: "Let's meet in front of the flower shop at five.", explanation: 'in front of the flower shopが待ち合わせ場所です。' },
  ]},
  { id: 'r005', type: '案内', title: 'Green Park Festival', passage: 'Come to the Green Park Festival on August 8! The music show starts at eleven. You can enjoy food from many countries from twelve to three. Children can make paper animals near the park office. Bring a hat because it may be hot. The festival ends at four.', translation: '8月8日のグリーン公園祭りへ来てください。音楽ショーは11時に始まります。12時から3時まで多くの国の食べ物を楽しめます。子どもは公園事務所の近くで紙の動物を作れます。暑いかもしれないので帽子を持ってきてください。祭りは4時に終わります。', questions: [
    { question: '音楽ショーは何時に始まりますか？', choices: ['10時', '11時', '12時', '3時'], answer: '11時', evidence: 'The music show starts at eleven.', explanation: 'starts at elevenが開始時刻です。' },
    { question: 'なぜ帽子を持っていくのですか？', choices: ['雨が降るから', '寒いから', '暑いかもしれないから', '動物を作るから'], answer: '暑いかもしれないから', evidence: 'Bring a hat because it may be hot.', explanation: 'becauseの後に理由があります。' },
  ]},
  { id: 'r006', type: 'メール', title: 'From: Mr. Hill / To: Class 2-B', passage: 'Tomorrow, our English class will be in Room 203, not in your classroom. Please bring your English book and a colored pencil. We will make posters about our favorite places. You do not need a dictionary. The class will start at nine as usual.', translation: '明日の英語の授業は皆さんの教室ではなく203号室で行います。英語の本と色鉛筆を持ってきてください。好きな場所についてポスターを作ります。辞書は必要ありません。授業はいつもどおり9時に始まります。', questions: [
    { question: '英語の授業はどこで行われますか？', choices: ['2-Bの教室', '図書館', '203号室', '音楽室'], answer: '203号室', evidence: 'our English class will be in Room 203', explanation: 'in Room 203が授業の場所です。' },
    { question: '持ってくる必要がないものは何ですか？', choices: ['英語の本', '色鉛筆', '辞書', 'かばん'], answer: '辞書', evidence: 'You do not need a dictionary.', explanation: 'do not needは「必要ない」です。' },
  ]},
  { id: 'r007', type: '物語', title: 'A Rainy Morning', passage: 'Sara left home at seven thirty. It started to rain when she was near the bus stop. She did not have an umbrella, but her classmate Yuki was there. Yuki had a large umbrella, so they walked to school together. They arrived five minutes before class.', translation: 'サラは7時30分に家を出ました。バス停の近くにいたとき雨が降り始めました。傘を持っていませんでしたが、同級生のユキがいました。ユキは大きな傘を持っていたので、一緒に学校まで歩きました。授業の5分前に着きました。', questions: [
    { question: '誰が傘を持っていましたか？', choices: ['サラ', 'ユキ', '先生', '二人とも'], answer: 'ユキ', evidence: 'Yuki had a large umbrella', explanation: 'had a large umbrellaの主語はYukiです。' },
    { question: '二人はどうやって学校へ行きましたか？', choices: ['歩いて', 'バスで', '自転車で', '車で'], answer: '歩いて', evidence: 'they walked to school together', explanation: 'walked to schoolは「歩いて学校へ行った」です。' },
  ]},
  { id: 'r008', type: '予定表', title: 'Saturday Plan', passage: "Amy's Saturday: 9:00 Tennis lesson; 11:30 Lunch with Nana; 1:00 Shopping; 3:30 Help her brother with math; 6:00 Dinner at home. Amy wants new shoes, so she will go to a sports shop after lunch. Her brother has a math test on Monday.", translation: 'エイミーの土曜日：9時 テニス、11時30分 ナナと昼食、1時 買い物、3時30分 弟の数学を手伝う、6時 家で夕食。新しい靴が欲しいので昼食後スポーツ店へ行きます。弟は月曜日に数学のテストがあります。', questions: [
    { question: 'エイミーは昼食後に何をしますか？', choices: ['テニス', '買い物', '数学の勉強', '夕食'], answer: '買い物', evidence: 'she will go to a sports shop after lunch', explanation: 'after lunchの予定はスポーツ店での買い物です。' },
    { question: '弟の数学のテストはいつですか？', choices: ['土曜日', '日曜日', '月曜日', '火曜日'], answer: '月曜日', evidence: 'Her brother has a math test on Monday.', explanation: 'on Mondayがテストの日です。' },
  ]},
  { id: 'r009', type: '紹介文', title: 'My New Pet', passage: 'My name is Rina. I got a small dog last month. His name is Pochi, and he is six months old. He likes playing with a red ball in our garden. I take him for a walk every morning before breakfast. On rainy days, we play inside.', translation: '私はリナです。先月小さな犬を飼い始めました。名前はポチで、生後6か月です。庭で赤いボールと遊ぶのが好きです。毎朝、朝食前に散歩させます。雨の日は家の中で遊びます。', questions: [
    { question: 'ポチは何歳ですか？', choices: ['生後1か月', '生後6か月', '1歳', '6歳'], answer: '生後6か月', evidence: 'he is six months old', explanation: 'six months oldは生後6か月です。' },
    { question: 'リナはいつポチを散歩させますか？', choices: ['朝食前', '朝食後', '放課後', '夕食後'], answer: '朝食前', evidence: 'every morning before breakfast', explanation: 'before breakfastは朝食前です。' },
  ]},
  { id: 'r010', type: 'メモ', title: 'Message for Dad', passage: 'Dad, I went to the swimming pool with Mai. I finished my homework before I left. We will be home around five. Mom called and said she will come home at six, so please start cooking rice at five thirty. The vegetables are in the refrigerator. — Kumi', translation: 'お父さんへ。マイとプールへ行きました。出かける前に宿題は終えました。5時ごろ家に戻ります。お母さんから電話があり、6時に帰るそうです。5時30分にご飯を炊き始めてください。野菜は冷蔵庫にあります。クミ', questions: [
    { question: 'クミはどこへ行きましたか？', choices: ['図書館', 'プール', '公園', '学校'], answer: 'プール', evidence: 'I went to the swimming pool with Mai.', explanation: 'went to the swimming poolが行き先です。' },
    { question: 'お父さんは何時にご飯を炊き始めますか？', choices: ['5時', '5時30分', '6時', '6時30分'], answer: '5時30分', evidence: 'please start cooking rice at five thirty', explanation: 'at five thirtyが時刻です。' },
  ]},
  { id: 'r011', type: '学校新聞', title: 'New School Lunch', passage: 'Our school will have a new lunch menu from September. On Wednesdays, students can choose rice or bread. Fruit will be served three times a week. The school asked students about their favorite fruit, and oranges were number one. The new menu will have oranges on Friday.', translation: '学校では9月から新しい給食メニューになります。水曜日はご飯かパンを選べます。果物は週3回出ます。好きな果物を生徒に尋ねたところ、オレンジが1位でした。新メニューでは金曜日にオレンジが出ます。', questions: [
    { question: '生徒がご飯かパンを選べるのは何曜日ですか？', choices: ['月曜日', '水曜日', '木曜日', '金曜日'], answer: '水曜日', evidence: 'On Wednesdays, students can choose rice or bread.', explanation: 'On Wednesdaysが曜日を示します。' },
    { question: '一番人気の果物は何ですか？', choices: ['りんご', 'バナナ', 'オレンジ', 'ぶどう'], answer: 'オレンジ', evidence: 'oranges were number one', explanation: 'number oneは1位という意味です。' },
  ]},
  { id: 'r012', type: '会話', title: 'At the Station', passage: "Anna: Excuse me, does this train go to Central Park? Man: No, you need the train on Platform Three. Anna: When does it leave? Man: In ten minutes, at two twenty. Anna: Thank you. Man: You're welcome. Hurry! It takes five minutes to walk there.", translation: 'アンナ：すみません、この電車は中央公園へ行きますか。男性：いいえ、3番ホームの電車に乗る必要があります。アンナ：いつ出ますか。男性：10分後の2時20分です。アンナ：ありがとう。男性：どういたしまして。急いで。そこまで歩いて5分かかります。', questions: [
    { question: 'アンナはどのホームへ行く必要がありますか？', choices: ['1番', '2番', '3番', '5番'], answer: '3番', evidence: 'you need the train on Platform Three', explanation: 'Platform Threeは3番ホームです。' },
    { question: '電車は何時に出ますか？', choices: ['2時10分', '2時15分', '2時20分', '2時30分'], answer: '2時20分', evidence: 'at two twenty', explanation: 'two twentyは2時20分です。' },
  ]},
  { id:'r013', type:'メール', title:'From: David / To: Ms. Sato', passage:'Dear Ms. Sato, I cannot come to school today because I have a fever. My mother will take me to the doctor this morning. Could you tell me about today’s homework? I left my math book at school, but I have my English book at home. Thank you, David', translation:'佐藤先生へ。熱があるため今日は学校へ行けません。母が今朝、医者へ連れて行きます。今日の宿題を教えていただけますか。数学の本は学校に置いてきましたが、英語の本は家にあります。デイビッド', questions:[
    {question:'デイビッドはなぜ学校を休みますか？',choices:['旅行へ行くから','熱があるから','本を忘れたから','母を手伝うから'],answer:'熱があるから',evidence:'because I have a fever',explanation:'becauseの後が欠席する理由です。'},
    {question:'学校に置いてある本は何ですか？',choices:['英語の本','数学の本','理科の本','歴史の本'],answer:'数学の本',evidence:'I left my math book at school',explanation:'left my math book at schoolとあります。'},
  ]},
  { id:'r014', type:'お知らせ', title:'Swimming Pool Rules', passage:'The City Swimming Pool is open from ten to six in July and August. Children under twelve must come with an adult. Please take a shower before swimming. Food and drinks are not allowed near the pool, but you may eat at the tables outside. The pool is closed every Tuesday.', translation:'市民プールは7月と8月の10時から6時まで開いています。12歳未満の子どもは大人と来なければなりません。泳ぐ前にシャワーを浴びてください。プールの近くでは飲食禁止ですが、外のテーブルでは食べられます。毎週火曜日は休みです。', questions:[
    {question:'プールが休みなのは何曜日ですか？',choices:['月曜日','火曜日','水曜日','日曜日'],answer:'火曜日',evidence:'The pool is closed every Tuesday.',explanation:'closed every Tuesdayが休館日です。'},
    {question:'食べることができる場所はどこですか？',choices:['プールの中','プールのそば','外のテーブル','更衣室'],answer:'外のテーブル',evidence:'you may eat at the tables outside',explanation:'may eat at the tables outsideと書かれています。'},
  ]},
  { id:'r015', type:'日記', title:'My First Cooking Class', passage:'Last Saturday, I joined a cooking class at the community center. We made vegetable curry and fruit salad. At first, I was afraid to use the large knife, but the teacher showed me how to use it safely. The curry was delicious, so I made it again for my family on Sunday.', translation:'先週土曜日、地域センターの料理教室に参加しました。野菜カレーとフルーツサラダを作りました。最初は大きな包丁を使うのが怖かったですが、先生が安全な使い方を教えてくれました。カレーがおいしかったので、日曜日に家族へもう一度作りました。', questions:[
    {question:'料理教室で何を作りましたか？',choices:['カレーとサラダ','パンとスープ','ケーキと紅茶','魚とご飯'],answer:'カレーとサラダ',evidence:'We made vegetable curry and fruit salad.',explanation:'madeの後に作った料理が並んでいます。'},
    {question:'日曜日に何をしましたか？',choices:['料理教室へ行った','包丁を買った','家族にカレーを作った','先生に会った'],answer:'家族にカレーを作った',evidence:'I made it again for my family on Sunday.',explanation:'itは前の文のcurryを指します。'},
  ]},
  { id:'r016', type:'案内', title:'English Club Trip', passage:'The English Club will visit an international center on October 12. Meet at the school gate at eight thirty. We will go there by bus and return at four. Bring your lunch, a notebook, and a pen. You do not need money. Please give your form to Mr. Brown by Friday.', translation:'英語部は10月12日に国際センターを訪問します。8時30分に校門へ集合してください。バスで行き、4時に戻ります。昼食、ノート、ペンを持参してください。お金は必要ありません。金曜日までにブラウン先生へ用紙を提出してください。', questions:[
    {question:'部員はどこに集合しますか？',choices:['駅','校門','国際センター','バス停'],answer:'校門',evidence:'Meet at the school gate at eight thirty.',explanation:'at the school gateが集合場所です。'},
    {question:'持っていく必要がないものは何ですか？',choices:['昼食','ノート','ペン','お金'],answer:'お金',evidence:'You do not need money.',explanation:'do not needは必要ないという意味です。'},
  ]},
  { id:'r017', type:'物語', title:'The Missing Wallet', passage:'On her way home, Miki found a brown wallet near a bus stop. There was no name in it, but there was a library card. She took the wallet to the library. A librarian called the owner, Mr. Lee. He came to the library and thanked Miki. He was very happy to get it back.', translation:'ミキは帰宅途中、バス停の近くで茶色い財布を見つけました。名前はありませんでしたが図書館カードが入っていました。財布を図書館へ持っていきました。司書が持ち主のリーさんへ電話しました。彼は図書館へ来てミキに感謝し、財布が戻ってとても喜びました。', questions:[
    {question:'財布の中に何がありましたか？',choices:['名前の紙','図書館カード','バスの切符','写真'],answer:'図書館カード',evidence:'there was a library card',explanation:'walletの中にlibrary cardがありました。'},
    {question:'ミキは財布をどこへ持っていきましたか？',choices:['警察署','学校','図書館','バス会社'],answer:'図書館',evidence:'She took the wallet to the library.',explanation:'took the wallet to the libraryが答えです。'},
  ]},
  { id:'r018', type:'学校新聞', title:'Cleaning Day', passage:'Last Friday was Cleaning Day at West Junior High School. First-year students cleaned classrooms, and second-year students worked in the garden. Third-year students collected old paper for recycling. The work started after lunch and finished at three. The garden group found five small frogs near the pond.', translation:'先週金曜日は西中学校の清掃日でした。1年生は教室を掃除し、2年生は庭で作業しました。3年生はリサイクル用の古紙を集めました。作業は昼食後に始まり3時に終わりました。庭のグループは池の近くで小さなカエルを5匹見つけました。', questions:[
    {question:'2年生はどこで作業しましたか？',choices:['教室','庭','図書館','体育館'],answer:'庭',evidence:'second-year students worked in the garden',explanation:'second-year studentsの作業場所はgardenです。'},
    {question:'清掃作業は何時に終わりましたか？',choices:['1時','2時','3時','5時'],answer:'3時',evidence:'finished at three',explanation:'finished at threeが終了時刻です。'},
  ]},
];
