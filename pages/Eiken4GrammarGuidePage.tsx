import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import ChevronRightIcon from '../components/shared/ChevronRightIcon';
import SpeakerWaveIcon from '../components/shared/SpeakerWaveIcon';
import { speakText } from '../services/speechService';

type Topic = {
  id: string; title: string; level: string; meaning: string; rule: string;
  examples: { en: string; ja: string }[]; mistake: string; tip: string;
  quiz: { question: string; choices: string[]; answer: string; explanation: string };
};

const topics: Topic[] = [
  { id:'past', title:'過去形・過去進行形', level:'最重要', meaning:'「昨日した」「そのとき、している途中だった」を表します。', rule:'ふつうの過去は 動詞の過去形。途中だった動作は was / were + 動詞ing。疑問文は Did + 主語 + 動詞の原形？', examples:[{en:'I visited Kyoto yesterday.',ja:'私は昨日、京都を訪れました。'},{en:'I was studying at eight.',ja:'私は8時に勉強しているところでした。'}], mistake:'Did you went? は×。Didを使ったら動詞は原形なので Did you go?。', tip:'yesterday、last week、ago が見えたら過去を疑おう。', quiz:{question:'「私はそのとき夕食を作っていました」',choices:['I cooked dinner then.','I was cooking dinner then.','I am cooking dinner then.'],answer:'I was cooking dinner then.',explanation:'「している途中だった」なので was + cooking。'} },
  { id:'future', title:'未来 will / be going to', level:'最重要', meaning:'「〜するつもり」「〜するでしょう」と、これからのことを表します。', rule:'will + 動詞の原形。または am / is / are going to + 動詞の原形。', examples:[{en:'I will help you.',ja:'私があなたを手伝います。'},{en:'We are going to play tennis.',ja:'私たちはテニスをする予定です。'}], mistake:'willの後を plays や played にしない。必ず動詞の原形。', tip:'その場で決めたことはwill、前からの予定はbe going toが基本。', quiz:{question:'「彼女は来週東京を訪れる予定です」',choices:['She is going to visit Tokyo next week.','She going to visits Tokyo next week.','She was visit Tokyo next week.'],answer:'She is going to visit Tokyo next week.',explanation:'主語がSheなので is going to + visit。'} },
  { id:'infinitive', title:'to不定詞', level:'最重要', meaning:'to + 動詞で「〜すること」「〜するために」「〜するための」を表せます。', rule:'want to、like to、need to のまとまりを先に覚えると簡単です。toの後は動詞の原形。', examples:[{en:'I want to be a doctor.',ja:'私は医者になりたいです。'},{en:'I went to the library to study.',ja:'私は勉強するために図書館へ行きました。'}], mistake:'want play は×。want to play とします。', tip:'want / hope / need の後に空所があれば to + 動詞を考えよう。', quiz:{question:'I want (　) English in Canada.',choices:['study','to study','studying'],answer:'to study',explanation:'want to + 動詞の原形で「〜したい」。'} },
  { id:'gerund', title:'動名詞（動詞ing）', level:'重要', meaning:'動詞にingをつけて「〜すること」という名詞のように使います。', rule:'enjoy / finish / practice の後は 動詞ing。likeの後は to不定詞も動名詞も使えます。', examples:[{en:'I enjoy reading books.',ja:'私は本を読むことを楽しみます。'},{en:'She finished doing her homework.',ja:'彼女は宿題をし終えました。'}], mistake:'enjoy to play は学校英語では×。enjoy playing。', tip:'enjoyを見たら、次の動詞はingと覚えよう。', quiz:{question:'Ken enjoys (　) soccer.',choices:['play','to playing','playing'],answer:'playing',explanation:'enjoyの後は動名詞 playing。'} },
  { id:'comparison', title:'比較級・最上級', level:'最重要', meaning:'2つを比べる「より〜」、3つ以上で「いちばん〜」を表します。', rule:'短い語は -er / -est。長い語は more / most。比較級にはthan、最上級にはtheを使います。', examples:[{en:'Tom is taller than Ken.',ja:'トムはケンより背が高いです。'},{en:'This is the most popular song.',ja:'これはいちばん人気のある歌です。'}], mistake:'more taller は×。tallerだけで「より高い」です。', tip:'good → better → best、many → more → most は特別なので暗記。', quiz:{question:'Mt. Fuji is (　) mountain in Japan.',choices:['high','higher','the highest'],answer:'the highest',explanation:'日本の中で「いちばん」なので the highest。'} },
  { id:'modal', title:'助動詞 must / have to / may', level:'最重要', meaning:'must・have toは「〜しなければならない」、mayは「〜してもよい／〜かもしれない」。', rule:'助動詞の後は動詞の原形。must not は「してはいけない」、do not have to は「しなくてもよい」で意味が違います。', examples:[{en:'You must do your homework.',ja:'あなたは宿題をしなければなりません。'},{en:'You do not have to hurry.',ja:'急ぐ必要はありません。'}], mistake:'must not と do not have to を同じ意味にしない。禁止と「必要なし」の違い。', tip:'英検ではこの意味の違いがよく問われます。', quiz:{question:'「ここで写真を撮ってはいけません」',choices:['You do not have to take pictures here.','You must not take pictures here.','You may take pictures here.'],answer:'You must not take pictures here.',explanation:'「してはいけない」は must not。'} },
  { id:'conjunction', title:'接続詞 when / if / because / that', level:'最重要', meaning:'2つの文を「〜するとき」「もし」「なぜなら」「〜ということ」でつなぎます。', rule:'when=〜するとき、if=もし〜なら、because=〜なので、I think that...=私は〜と思う。', examples:[{en:'Call me when you get home.',ja:'家に着いたら電話して。'},{en:'I stayed home because it was raining.',ja:'雨だったので家にいました。'}], mistake:'未来のことでも when / if の中は基本的に現在形。when you will get home ではなく when you get home。', tip:'空所の前後が文なら、意味に合う接続詞を選ぶ。', quiz:{question:'I was tired, (　) I went to bed early.',choices:['because','so','if'],answer:'so',explanation:'「疲れていた、だから早く寝た」なので so。'} },
  { id:'give', title:'give / show / tell + 人 + もの', level:'重要', meaning:'「人にものをあげる・見せる・伝える」の語順です。', rule:'give me a book = give a book to me。show me the picture、tell me the story も同じ語順。', examples:[{en:'My father gave me this bag.',ja:'父は私にこのかばんをくれました。'},{en:'Please show me your ticket.',ja:'私に切符を見せてください。'}], mistake:'explain me は×。explain it to me の形にします。', tip:'give / show / tell の直後に「人」が来る形を覚えよう。', quiz:{question:'「彼は私に写真を見せました」',choices:['He showed me a picture.','He showed a picture me.','He show me a picture.'],answer:'He showed me a picture.',explanation:'showed + 人(me) + もの(a picture)。過去なのでshowed。'} },
  { id:'there', title:'There is / There are', level:'基礎確認', meaning:'「〜があります・います」と、初めて話題に出すものの存在を伝えます。', rule:'1つなら There is、2つ以上なら There are。過去は There was / There were。', examples:[{en:'There is a park near here.',ja:'この近くに公園があります。'},{en:'There were many people.',ja:'たくさんの人がいました。'}], mistake:'There is two books は×。複数なので There are two books。', tip:'直後の名詞が1つか複数かを見る。', quiz:{question:'(　) three students in the room.',choices:['There is','There are','It is'],answer:'There are',explanation:'three students は複数なので There are。'} },
];

const Eiken4GrammarGuidePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const requestedTopic = new URLSearchParams(location.search).get('topic');
  const [openId, setOpenId] = useState<string | null>(topics.some(topic => topic.id === requestedTopic) ? requestedTopic : topics[0].id);
  const [answers, setAnswers] = useState<Record<string,string>>({});
  return <div className="flex-grow bg-gradient-to-b from-cyan-50 to-white p-4 sm:p-6">
    <div className="mx-auto max-w-2xl">
      <Button onClick={() => navigate('/eiken4')} variant="ghost" size="sm"><ArrowLeftIcon className="h-5 w-5 mr-2"/>英検4級に戻る</Button>
      <header className="mt-4 rounded-3xl bg-gradient-to-br from-cyan-600 to-blue-700 p-6 text-white shadow-xl">
        <p className="text-xs font-bold tracking-widest text-cyan-100">ZERO-START GRAMMAR</p><h1 className="mt-2 text-3xl font-bold">はじめての英検4級文法</h1><p className="mt-3 leading-7 text-cyan-50">まだ学校で習っていなくても大丈夫。上から読めば、問題を解くための形と意味がわかります。</p>
      </header>
      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"><p className="font-bold">おすすめの使い方</p><p className="mt-1">1日1項目だけ読む → 例文を音で聞く → 最後の1問を解く。全部を一度に暗記しなくてOKです。</p></div>
      <div className="mt-5 space-y-3">{topics.map((topic,index) => {
        const open = openId === topic.id; const picked = answers[topic.id]; const correct = picked === topic.quiz.answer;
        return <article key={topic.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <button onClick={() => setOpenId(open ? null : topic.id)} className="flex w-full items-center gap-3 p-4 text-left"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-100 font-bold text-cyan-800">{index+1}</span><div className="flex-grow"><p className="text-xs font-bold text-cyan-700">{topic.level}</p><h2 className="text-lg font-bold text-slate-800">{topic.title}</h2></div><ChevronRightIcon className={`h-6 w-6 text-slate-400 transition-transform ${open?'rotate-90':''}`}/></button>
          {open && <div className="border-t border-slate-100 p-5">
            <p className="text-lg font-bold leading-8 text-slate-800">{topic.meaning}</p><div className="mt-4 rounded-xl bg-blue-50 p-4"><p className="text-xs font-bold text-blue-600">作り方</p><p className="mt-1 leading-7 text-blue-950">{topic.rule}</p></div>
            <div className="mt-4 space-y-3">{topic.examples.map(example=><div key={example.en} className="rounded-xl border border-slate-200 p-3"><div className="flex items-start justify-between gap-2"><p className="font-bold text-slate-800">{example.en}</p><button onClick={()=>speakText(example.en,'en-US',.8)} aria-label="例文を聞く" className="shrink-0 rounded-full bg-indigo-50 p-2 text-indigo-700"><SpeakerWaveIcon className="h-5 w-5"/></button></div><p className="mt-1 text-sm text-slate-600">{example.ja}</p></div>)}</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-rose-50 p-3 text-sm text-rose-900"><p className="font-bold">よくある間違い</p><p className="mt-1">{topic.mistake}</p></div><div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900"><p className="font-bold">英検での見つけ方</p><p className="mt-1">{topic.tip}</p></div></div>
            <div className="mt-5 rounded-xl border-2 border-violet-200 bg-violet-50 p-4"><p className="text-xs font-bold text-violet-600">1問チェック</p><p className="mt-1 font-bold text-slate-800">{topic.quiz.question}</p><div className="mt-3 grid gap-2">{topic.quiz.choices.map(choice=><button key={choice} disabled={Boolean(picked)} onClick={()=>setAnswers(value=>({...value,[topic.id]:choice}))} className={`rounded-lg border p-3 text-left font-semibold ${picked && choice===topic.quiz.answer?'border-emerald-500 bg-emerald-50 text-emerald-800':picked===choice?'border-rose-500 bg-rose-50 text-rose-800':'border-violet-200 bg-white text-slate-700'}`}>{choice}</button>)}</div>{picked&&<div className={`mt-3 rounded-lg p-3 ${correct?'bg-emerald-100':'bg-amber-100'}`}><p className="font-bold">{correct?'正解！':`正解：${topic.quiz.answer}`}</p><p className="mt-1 text-sm">{topic.quiz.explanation}</p><button onClick={()=>setAnswers(value=>{const next={...value};delete next[topic.id];return next;})} className="mt-2 text-sm font-bold text-indigo-700">もう一度解く</button></div>}</div>
          </div>}
        </article>;
      })}</div>
      <Button onClick={() => navigate('/eiken4/sentences')} className="mt-6 w-full" size="lg">並べ替え問題で練習する</Button>
    </div>
  </div>;
};
export default Eiken4GrammarGuidePage;
