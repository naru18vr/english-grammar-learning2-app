import { Sentence } from '../types';

type PracticeFactory = (index: number) => Omit<Sentence, 'id'>;

const people = [
  ['I', '私は'], ['You', 'あなたは'], ['We', '私たちは'], ['They', '彼らは'],
] as const;
const names = [
  ['Ken', 'ケンは'], ['Mika', 'ミカは'], ['Tom', 'トムは'], ['Yumi', 'ユミは'],
] as const;
const places = [
  ['the library', '図書館'], ['the park', '公園'], ['school', '学校'], ['the station', '駅'],
] as const;

const sentence = (japaneseQuestion: string, english: string, grammarTag: string, explanation: string): Omit<Sentence, 'id'> => ({
  japaneseQuestion,
  words: english.match(/[A-Za-z0-9']+|[.,?!]/g) ?? [],
  grammarTag,
  explanation,
});

const factories: Record<string, PracticeFactory[]> = {
  g1u1: [
    i => { const [en, ja] = people[i % people.length]; return sentence(`${ja}毎日英語を勉強します。`, `${en} study English every day.`, '一般動詞の肯定文', '一般動詞は主語のすぐ後ろに置きます。'); },
    i => { const [en, ja] = people[i % people.length]; return sentence(`${ja}サッカーが好きではありません。`, `${en} do not like soccer.`, '一般動詞の否定文', '一般動詞の否定文はdo not＋動詞の原形です。'); },
    i => { const [en, ja] = people[i % people.length]; return sentence(`${ja}中学生です。`, `${en} ${en === 'I' ? 'am' : 'are'} a junior high school student.`, 'be動詞の肯定文', 'Iにはam、youや複数の主語にはareを使います。'); },
    i => sentence(`私は${['音楽','英語','テニス','犬'][i % 4]}が好きです。`, `I like ${['music','English','tennis','dogs'][i % 4]}.`, '一般動詞の肯定文', 'likeの後ろに好きなものを置きます。'),
  ],
  g1u2: [
    i => { const [en, ja] = names[i % names.length]; return sentence(`${ja}テニスをします。`, `${en} plays tennis.`, 'He/She の一般動詞', 'heやsheなど一人を表す主語では動詞にsを付けます。'); },
    i => { const [en, ja] = names[i % names.length]; return sentence(`${ja}ピアノを弾けます。`, `${en} can play the piano.`, 'can の肯定文', 'canの後ろは動詞の原形です。'); },
    i => sentence(`これは私の${['本','かばん','ペン','机'][i % 4]}です。`, `This is my ${['book','bag','pen','desk'][i % 4]}.`, 'This is の文', '近くの一つのものはThis isで表します。'),
  ],
  g1u3: [
    i => sentence(`${['図書館','体育館','音楽室','職員室'][i % 4]}はどこですか？`, `Where is the ${['library','gym','music room','teachers room'][i % 4]}?`, 'Where ~? の文', '場所を尋ねるときはWhereを文頭に置きます。'),
    i => sentence(`あなたはいつ${['英語を勉強します','昼食を食べます','家に帰ります','テニスをします'][i % 4]}か？`, `When do you ${['study English','eat lunch','go home','play tennis'][i % 4]}?`, 'When ~? の文', '時を尋ねるときはWhenを文頭に置きます。'),
    i => sentence(`あの${['男の子','女の子','男性','女性'][i % 4]}はだれですか？`, `Who is that ${['boy','girl','man','woman'][i % 4]}?`, 'Who ~? の文', '人を尋ねるときはWhoを使います。'),
    i => sentence(`あなたの好きな${['食べ物','スポーツ','教科','音楽'][i % 4]}は何ですか？`, `What is your favorite ${['food','sport','subject','music'][i % 4]}?`, 'What ~? の文', 'ものや内容を尋ねるときはWhatを使います。'),
    i => sentence(`あなたは${['元気です','学校へ行きます','英語を勉強します','昼食を作ります'][i % 4]}か？`, `How ${['are you','do you go to school','do you study English','do you make lunch'][i % 4]}?`, 'How ~? の文', '方法や様子を尋ねるときはHowを使います。'),
    i => sentence(`${['あなたの兄','あなたの弟','あなたの姉','ケン'][i % 4]}は何歳ですか？`, `How old is ${['your brother','your brother','your sister','Ken'][i % 4]}?`, 'How ~? の文', '年齢を尋ねるときはHow oldを使います。'),
  ],
  g1u4: [
    i => sentence(`${['ドアを開けて','ここに座って','この本を読んで','私を手伝って'][i % 4]}ください。`, `${['Open the door','Sit here','Read this book','Help me'][i % 4]}, please.`, '命令文', '命令文は動詞の原形で始めます。'),
    i => sentence(`${['ここで走らないで','窓を開けないで','その箱に触らないで','遅れないで'][i % 4]}ください。`, `Do not ${['run here','open the window','touch that box','be late'][i % 4]}.`, '否定の命令文', '禁止はDo not＋動詞の原形で表します。'),
    i => sentence(`あなたは何個の${['本','ペン','りんご','かばん'][i % 4]}を持っていますか？`, `How many ${['books','pens','apples','bags'][i % 4]} do you have?`, 'How many ~? の文', '数を尋ねるときはHow many＋複数名詞を使います。'),
  ],
  g1u5: [
    i => { const [en, ja] = names[i % names.length]; return sentence(`${ja}毎朝早く起きます。`, `${en} gets up early every morning.`, '主語が三人称単数の肯定文', '主語が一人の人なら一般動詞にsを付けます。'); },
    i => { const [en, ja] = names[i % names.length]; return sentence(`${ja}野球をしません。`, `${en} does not play baseball.`, '主語が三人称単数の否定文', '否定文はdoes not＋動詞の原形です。'); },
    i => { const [en, ja] = names[i % names.length]; return sentence(`${ja}放課後に何をしますか？`, `What does ${en} do after school?`, '主語が三人称単数の疑問文', '疑問文はdoesを使い、動詞は原形に戻します。'); },
  ],
  g1u6: [
    i => sentence(`私は${['彼','彼女','彼ら','あなた'][i % 4]}をよく知っています。`, `I know ${['him','her','them','you'][i % 4]} well.`, '目的格', '動詞の後ろではhim、her、themなどの目的格を使います。'),
    i => sentence(`これはだれの${['本','かばん','自転車','傘'][i % 4]}ですか？`, `Whose ${['book','bag','bike','umbrella'][i % 4]} is this?`, 'Whose ~? の文', '持ち主を尋ねるときはWhoseを使います。'),
    i => sentence(`どちらの${['本','ペン','帽子','自転車'][i % 4]}があなたのものですか？`, `Which ${['book','pen','cap','bike'][i % 4]} is yours?`, 'Which ~? の文', '限られた中から選ぶときはWhichを使います。'),
    i => sentence(`私は${['彼に手紙を渡します','彼女を手伝います','彼らと話します','あなたを待ちます'][i % 4]}。`, `I ${['give him a letter','help her','talk with them','wait for you'][i % 4]}.`, '目的格', '動詞や前置詞の後ろでは目的格を使います。'),
  ],
  g1u7: [
    i => { const [en, ja] = names[i % names.length]; return sentence(`${ja}今${['本を読んでいます','昼食を食べています','走っています','英語を勉強しています'][i % 4]}。`, `${en} is ${['reading a book','eating lunch','running','studying English'][i % 4]} now.`, '現在進行形の肯定文', '今している動作はbe動詞＋動詞のing形で表します。'); },
    i => sentence(`あなたは今${['テレビを見ています','音楽を聞いています','夕食を作っています','宿題をしています'][i % 4]}か？`, `Are you ${['watching TV','listening to music','cooking dinner','doing your homework'][i % 4]} now?`, '現在進行形の疑問文', '疑問文はbe動詞を主語の前に置きます。'),
    i => sentence(`私は今${['走っていません','本を読んでいません','テレビを見ていません','昼食を食べていません'][i % 4]}。`, `I am not ${['running','reading a book','watching TV','eating lunch'][i % 4]} now.`, '現在進行形の否定文', '否定文はbe動詞の後ろにnotを置きます。'),
    i => sentence(`${['ケンは何をしています','ミカはどこで走っています','彼らは何を食べています','あなたの弟は何を読んでいます'][i % 4]}か？`, `${['What is Ken doing','Where is Mika running','What are they eating','What is your brother reading'][i % 4]}?`, '現在進行形の疑問文', '疑問詞の後ろはbe動詞＋主語＋動詞のing形です。'),
  ],
  g1u8: [
    i => sentence(`私は${['医者','先生','料理人','歌手'][i % 4]}になりたいです。`, `I want to be a ${['doctor','teacher','cook','singer'][i % 4]}.`, 'want to 〜', 'want to＋動詞の原形で「〜したい」を表します。'),
    i => sentence(`その${['ケーキはおいしそう','犬は幸せそう','空は暗く見え','部屋はきれいに見え'][i % 4]}ます。`, `The ${['cake looks delicious','dog looks happy','sky looks dark','room looks clean'][i % 4]}.`, 'look + 形容詞', 'look＋形容詞で「〜に見える」を表します。'),
  ],
  g2u1: [
    i => sentence(`私は${['明日図書館へ行く','今夜宿題をする','週末に祖母を訪ねる','放課後テニスをする'][i % 4]}予定です。`, `I am going to ${['go to the library tomorrow','do my homework tonight','visit my grandmother this weekend','play tennis after school'][i % 4]}.`, 'be going to 〜', '予定はbe going to＋動詞の原形で表します。'),
    i => sentence(`私は${['あなたを手伝い','あとで電話し','その本を読み','早く帰り'][i % 4]}ます。`, `I will ${['help you','call you later','read the book','come home early'][i % 4]}.`, 'will 〜 の文', 'will＋動詞の原形で未来や意志を表します。'),
    i => sentence(`彼らはその${['犬をポチ','猫をタマ','少年をリーダー','赤ちゃんをケン'][i % 4]}と呼びます。`, `They call the ${['dog Pochi','cat Tama','boy their leader','baby Ken'][i % 4]}.`, 'call A B の文', 'call A Bで「AをBと呼ぶ」を表します。'),
  ],
  g2u2: [
    i => sentence(`私が${['家に着いた','駅に着いた','教室に入った','彼に会った'][i % 4]}とき、雨が降っていました。`, `It was raining when I ${['got home','arrived at the station','entered the classroom','met him'][i % 4]}.`, 'when 〜 の文', 'whenは「〜するとき」を表します。'),
    i => sentence(`もし${['晴れたら公園へ行き','時間があれば手伝い','疲れているなら休み','雨なら家にい'][i % 4]}ます。`, `If ${['it is sunny, we will go to the park','you have time, please help me','you are tired, take a rest','it rains, I will stay home'][i % 4]}.`, 'if 〜 の文', 'ifは「もし〜なら」を表します。'),
    i => sentence(`私は${['英語が好きなので毎日勉強します','疲れていたので早く寝ました','雨だったので家にいました','空腹だったので昼食を食べました'][i % 4]}。`, `I ${['study English every day because I like it','went to bed early because I was tired','stayed home because it was rainy','ate lunch because I was hungry'][i % 4]}.`, 'because 〜 の文', 'becauseは理由を表します。'),
    i => sentence(`私は${['彼が親切だ','この本が面白い','明日は晴れる','彼女が正しい'][i % 4]}と思います。`, `I think that ${['he is kind','this book is interesting','it will be sunny tomorrow','she is right'][i % 4]}.`, 'I think that 〜. の文', 'thatの後ろに考えの内容を続けます。'),
    i => sentence(`${['母は私が帰宅したとき料理をしていました','父は雨だったので車で来ました','彼は時間があれば私を手伝います','私は彼女が元気だと知っています'][i % 4]}。`, `${['My mother was cooking when I came home','My father came by car because it was rainy','He will help me if he has time','I know that she is well'][i % 4]}.`, ['when 〜 の文','because 〜 の文','if 〜 の文','know that 〜. の文'][i % 4], '接続詞の後ろには主語＋動詞を含む文を置きます。'),
    i => sentence(`${['学校が終わったら図書館へ行きます','眠かったのでコーヒーを飲みました','もし寒ければ窓を閉めてください','私は彼が来ると信じています'][i % 4]}。`, `${['I will go to the library when school is over','I drank coffee because I was sleepy','If it is cold, please close the window','I believe that he will come'][i % 4]}.`, ['when 〜 の文','because 〜 の文','if 〜 の文','believe that 〜. の文'][i % 4], 'when・because・if・thatの基本語順を確認します。'),
  ],
  g2u3: [
    i => sentence(`私は${['本を借りるために図書館へ','友達に会うために公園へ','英語を勉強するために学校へ','昼食を買うために店へ'][i % 4]}行きました。`, `I went to ${['the library to borrow a book','the park to meet my friend','school to study English','the shop to buy lunch'][i % 4]}.`, '不定詞（目的）', 'to＋動詞の原形で「〜するために」と目的を表します。'),
    i => sentence(`私は${['あなたに会えてうれしい','その知らせを聞いて驚いた','試合に勝ってうれしい','彼が無事だと知ってうれしい'][i % 4]}です。`, `I am ${['glad to see you','surprised to hear the news','happy to win the game','glad to know he is safe'][i % 4]}.`, '不定詞（感情の原因）', '感情を表す形容詞の後ろの不定詞が、その原因を説明します。'),
    i => sentence(`私には${['今日読む本','するべき宿題','書く手紙','訪れる場所'][i % 4]}があります。`, `I have ${['a book to read today','homework to do','a letter to write','a place to visit'][i % 4]}.`, '不定詞（形容詞的用法）', '名詞の後ろのto＋動詞が、その名詞を説明します。'),
  ],
  g2u5: [
    i => sentence(`私は${['何をすべきか','どこへ行くべきか','いつ出発すべきか','どう使うべきか'][i % 4]}分かりません。`, `I do not know ${['what to do','where to go','when to leave','how to use it'][i % 4]}.`, '疑問詞 + to 〜', '疑問詞＋to＋動詞の原形で「何を／どこで〜すべきか」を表します。'),
    i => sentence(`先生は私に${['何を読むべきか','どこに座るべきか','いつ来るべきか','どう始めるべきか'][i % 4]}教えてくれました。`, `The teacher told me ${['what to read','where to sit','when to come','how to start'][i % 4]}.`, '動詞 + 人 + 疑問詞 + to 〜', '人の後ろに疑問詞＋toを置きます。'),
    i => sentence(`私は${['あなたが無事で','彼が来て','試験が簡単で','みんなが親切で'][i % 4]}うれしいです。`, `I am glad that ${['you are safe','he came','the test was easy','everyone is kind'][i % 4]}.`, '主語 + be動詞 + 形容詞 + that 〜', '形容詞の理由や内容をthat節で説明します。'),
  ],
  g3u1: [
    i => sentence(`私は${['この本を二度読んだ','京都へ三度行った','その映画を見た','以前彼に会った','すしを食べた','富士山を見た','英語で手紙を書いた','新幹線に乗った','沖縄を訪れた','その歌を聞いた','海で泳いだ','外国人と話した'][i % 12]}ことがあります。`, `I have ${['read this book twice','been to Kyoto three times','seen the movie','met him before','eaten sushi','seen Mt. Fuji','written a letter in English','ridden the Shinkansen','visited Okinawa','heard the song','swum in the sea','talked with a foreign visitor'][i % 12]}.`, '現在完了形「経験」', 'have＋過去分詞で経験を表します。'),
    i => sentence(['その出来事は私を幸せにしました。','その出来事は私を悲しくしました。','その出来事は私を驚かせました。','その音楽は私を落ち着かせました。','その知らせは私を不安にしました。','その言葉は私を怒らせました。','その授業は私を眠くしました。','その仕事は私を疲れさせました。','先生は私たちを静かにしました。','その仕事は私を忙しくしました。','その経験は私を強くしました。','その経験は私を勇敢にしました。'][i % 12], `${['The event made me happy','The event made me sad','The event made me surprised','The music made me calm','The news made me worried','The words made me angry','The class made me sleepy','The work made me tired','The teacher made us quiet','The work made me busy','The experience made me strong','The experience made me brave'][i % 12]}.`, 'make A B', 'make A Bで「AをBの状態にする」を表します。'),
    i => sentence(`先生は私たちに${['試験は月曜日だ','本を読むべきだ','明日は休みだ','英語は大切だ','授業は9時に始まる','宿題は簡単だ','図書館は閉まっている','今日は暑い','来週テストがある','その答えは正しい','時間を守るべきだ','毎日練習すべきだ'][i % 12]}と言いました。`, `The teacher told us that ${['the test was on Monday','we should read the book','tomorrow was a holiday','English was important','class started at nine','the homework was easy','the library was closed','it was hot that day','we would have a test the next week','the answer was right','we should be on time','we should practice every day'][i % 12]}.`, 'tell + 人 + that 〜', 'tell＋人＋that節で伝えた内容を表します。'),
  ],
  g3u3: [
    i => sentence(`${['私たち','生徒','子供たち','あなた','彼','彼女','観光客','地域の人々'][i % 8]}が${['自然を守る','規則を守る','英語を学ぶ','毎日練習する','時間を守る','よく眠る','地図を持つ','助け合う'][i % 8]}ことは大切です。`, `It is important for ${['us','students','children','you','him','her','visitors','local people'][i % 8]} to ${['protect nature','follow the rules','learn English','practice every day','be on time','sleep well','have a map','help each other'][i % 8]}.`, 'It is ... for (人) to 〜', 'forの後ろに不定詞の動作をする人を置きます。'),
    i => sentence(`私は${['あなたに手伝って','彼に医者になって','彼女にここへ来て','みんなに参加して','ケンに本を読んで','両親に見て','先生に説明して','友達に待って'][i % 8]}ほしいです。`, `I want ${['you to help me','him to be a doctor','her to come here','everyone to join us','Ken to read the book','my parents to watch me','the teacher to explain it','my friend to wait for me'][i % 8]}.`, 'want + 人 + to 〜', 'want＋人＋toで「人に〜してほしい」を表します。'),
    i => sentence(`${['先生は私たちに英語を話させ','母は私が夕食を作るのを手伝い','彼は私がその箱を運ぶのを手伝い','父は私に自分で選ばせ','姉は私が宿題をするのを手伝い','母は私に外で遊ばせ','友達は私が答えを見つけるのを手伝い','先生は生徒に質問させ'][i % 8]}ました。`, `${['The teacher let us speak English','My mother helped me cook dinner','He helped me carry the box','My father let me choose for myself','My sister helped me do my homework','My mother let me play outside','My friend helped me find the answer','The teacher let the students ask questions'][i % 8]}.`, 'let・help + 人 + 動詞の原形', 'letやhelpの後ろは人＋動詞の原形です。'),
    i => sentence(`先生は${['私に声を出して読んで','私たちに毎日練習して','彼にもう一度答えて','彼女に絵を見せて','生徒に静かにして','ケンに窓を開けて','ミカに英語を話して','みんなに協力して'][i % 8]}ほしいと思っています。`, `The teacher wants ${['me to read aloud','us to practice every day','him to answer again','her to show the picture','the students to be quiet','Ken to open the window','Mika to speak English','everyone to work together'][i % 8]}.`, 'want + 人 + to 〜', 'want＋人＋toの主語はI以外にもできます。'),
    i => sentence(`${['友達は私に自転車を使わせ','父は私が机を動かすのを手伝い','先生は私たちに辞書を使わせ','姉は私が部屋を掃除するのを手伝い','母は私に夕食を選ばせ','ケンは私が道を探すのを手伝い','先生は生徒に話し合わせ','友達は私が英語を練習するのを手伝い'][i % 8]}ました。`, `${['My friend let me use the bike','My father helped me move the desk','The teacher let us use a dictionary','My sister helped me clean the room','My mother let me choose dinner','Ken helped me find the way','The teacher let the students talk','My friend helped me practice English'][i % 8]}.`, 'let・help + 人 + 動詞の原形', 'letは許可、helpは手助けを表します。'),
  ],
  g3u4: [
    i => sentence(`あなたは${['彼がどこに住んでいるか','次の電車がいつ来るか','彼女が何を欲しがっているか','なぜ彼が休んだか'][i % 4]}知っていますか？`, `Do you know ${['where he lives','when the next train comes','what she wants','why he was absent'][i % 4]}?`, '間接疑問文', '疑問詞の後ろは主語＋動詞の語順です。'),
    i => sentence(`${['窓のそばで本を読んでいる少女','公園で走っている少年','英語を話している女性','ギターを弾いている男性'][i % 4]}は私の友達です。`, `The ${['girl reading a book by the window','boy running in the park','woman speaking English','man playing the guitar'][i % 4]} is my friend.`, '現在分詞の後置修飾', '名詞の後ろの現在分詞が「〜している」と説明します。'),
    i => sentence(`これは${['日本で作られた車','英語で書かれた本','昨日撮られた写真','ケンが焼いたケーキ'][i % 4]}です。`, `This is ${['a car made in Japan','a book written in English','a picture taken yesterday','a cake baked by Ken'][i % 4]}.`, '過去分詞の後置修飾', '名詞の後ろの過去分詞が「〜された」と説明します。'),
  ],
  g3u5: [
    i => sentence(`これは私が${['昨日買った本','今朝書いた手紙','公園で撮った写真','学校で使うかばん'][i % 4]}です。`, `This is the ${['book I bought yesterday','letter I wrote this morning','picture I took in the park','bag I use at school'][i % 4]}.`, '接触節', '名詞の後ろに主語＋動詞を続けて説明します。'),
    i => sentence(`${['英語を教えている女性','そこで走っている少年','私を助けてくれた少女','ギターを弾ける男性'][i % 4]}は私の先生です。`, `The ${['woman who teaches English','boy who is running there','girl who helped me','man who can play the guitar'][i % 4]} is my teacher.`, '関係代名詞 who', '人を説明するときはwhoを使います。'),
    i => sentence(`これは${['京都へ行く電車','私が好きな歌','彼が使うコンピューター','昨日届いた箱'][i % 4]}です。`, `This is the ${['train that goes to Kyoto','song that I like','computer which he uses','box that arrived yesterday'][i % 4]}.`, '関係代名詞 that / which', '物を説明するときはthatやwhichを使います。'),
    i => sentence(`${['私が昨日会った人','私たちを教えている先生','駅で働く女性','その本を書いた男性'][i % 4]}は親切です。`, `The ${['person who I met yesterday','teacher who teaches us','woman who works at the station','man who wrote the book'][i % 4]} is kind.`, '関係代名詞 who', 'whoを使って人について説明します。'),
    i => sentence(`私が${['毎日使う机','昨日見た映画','駅で買った地図','いちばん好きな教科'][i % 4]}はこれです。`, `This is the ${['desk that I use every day','movie that I saw yesterday','map which I bought at the station','subject that I like the best'][i % 4]}.`, '関係代名詞 that / which', '目的語になる関係代名詞はthatまたはwhichを使います。'),
  ],
};

// 旧版問題の単語だけを機械置換せず、文法ごとに対訳を確認した補充問題から50問にそろえる。
export const expandUnitToFifty = (sentences: Sentence[], prefix: string): Sentence[] => {
  const result = sentences.slice(0, 50).map(item => ({ ...item, words: [...item.words] }));
  const unitFactories = factories[prefix];
  if (!unitFactories) throw new Error(`${prefix}: 補充問題が定義されていません`);
  const usedIds = new Set(result.map(item => item.id));
  const usedContent = new Set(result.map(item => `${item.japaneseQuestion}|${item.words.join(' ')}`));
  let turn = 0;
  while (result.length < 50 && turn < 500) {
    const item = unitFactories[turn % unitFactories.length](Math.floor(turn / unitFactories.length));
    const key = `${item.japaneseQuestion}|${item.words.join(' ')}`;
    if (!usedContent.has(key)) {
      let serial = result.length + 1;
      while (usedIds.has(`${prefix}s${serial}`)) serial += 1;
      const id = `${prefix}s${serial}`;
      result.push({ id, ...item });
      usedIds.add(id);
      usedContent.add(key);
    }
    turn += 1;
  }
  if (result.length !== 50) throw new Error(`${prefix}: 50問を作成できませんでした（${result.length}問）`);
  return result;
};
