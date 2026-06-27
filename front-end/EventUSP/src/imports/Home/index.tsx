import svgPaths from "./svg-dl5nmemr2r";
import imgBanner from "./ce29ef052d87c7bc33c6815bfc44560271a89b19.png";
import imgImage17 from "./1aa98fbb00a5265413c686dd104679392c64fa9f.png";
import imgFotoPerfil from "./f55472821ab9320c8f6774ee1ec65c7e9ba72e9c.png";
import imgCapa from "./c595608c2b9f266bc558b554aa638beb4fbf0766.png";
import imgImage22 from "./b7cd6e85df756aa7794f591a5aa76b5d8d0459bc.png";
import imgImage23 from "./7a45f258ae9fa972b4d55336fd43edb5ed12fcd2.png";

function Battery() {
  return (
    <div className="absolute contents right-[14.67px] top-[17.33px]" data-name="Battery">
      <div className="absolute h-[11.333px] right-[17px] top-[17.33px] w-[22px]" data-name="Rectangle">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 11.3333">
          <path d={svgPaths.p7e6b880} id="Rectangle" opacity="0.35" stroke="var(--stroke-0, black)" />
        </svg>
      </div>
      <div className="absolute h-[4px] right-[14.67px] top-[21px] w-[1.328px]" data-name="Combined Shape">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.32804 4">
          <path d={svgPaths.p32d253c0} fill="var(--fill-0, black)" id="Combined Shape" opacity="0.4" />
        </svg>
      </div>
      <div className="absolute h-[7.333px] right-[19px] top-[19.33px] w-[18px]" data-name="Rectangle">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 7.33333">
          <path d={svgPaths.p3544af00} fill="var(--fill-0, black)" id="Rectangle" />
        </svg>
      </div>
    </div>
  );
}

function RightSide() {
  return (
    <div className="absolute contents right-[14.67px] top-[17.33px]" data-name="Right Side">
      <Battery />
      <div className="absolute h-[10.965px] right-[44.03px] top-[17.33px] w-[15.272px]" data-name="Wifi">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.2725 10.965">
          <path d={svgPaths.p2d664a80} fill="var(--fill-0, black)" id="Wifi" />
        </svg>
      </div>
      <div className="absolute h-[10.667px] right-[64.33px] top-[17.67px] w-[17px]" data-name="Mobile Signal">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 10.667">
          <path d={svgPaths.p3a894e80} fill="var(--fill-0, black)" id="Mobile Signal" />
        </svg>
      </div>
    </div>
  );
}

function Time() {
  return (
    <div className="absolute h-[21px] left-[21px] top-[12px] w-[54px]" data-name="Time">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 54 21">
        <g id="Time">
          <g id="9:41">
            <path d={svgPaths.p3de63e00} fill="var(--fill-0, black)" />
            <path d={svgPaths.p3029a300} fill="var(--fill-0, black)" />
            <path d={svgPaths.p2e0c43c0} fill="var(--fill-0, black)" />
            <path d={svgPaths.p38350600} fill="var(--fill-0, black)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function LeftSide() {
  return (
    <div className="absolute contents left-[21px] top-[12px]" data-name="Left Side">
      <Time />
    </div>
  );
}

function StatusBar() {
  return (
    <div className="h-[40px] overflow-clip relative shrink-0 w-full" data-name="Status Bar">
      <RightSide />
      <LeftSide />
    </div>
  );
}

function Frame() {
  return (
    <div className="h-[53px] relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[30px] relative size-full">
          <div className="[word-break:break-word] flex flex-col font-['Montserrat:Bold',sans-serif] font-bold h-[46px] justify-center leading-[0] relative shrink-0 text-[#87d4e4] text-[40px] text-center w-[218px]">
            <p className="leading-[30px]">EventUSP</p>
          </div>
          <div className="overflow-clip relative shrink-0 size-[20px]" data-name="Icon_3pt/Bell">
            <div className="absolute inset-[1.04%_9.86%_7.29%_9.86%]" data-name="bell">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.0578 18.3333">
                <path d={svgPaths.p3553a980} fill="var(--fill-0, black)" id="bell" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Pagination() {
  return (
    <div className="h-[5px] relative shrink-0 w-[45px]" data-name="Pagination">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 45 5">
        <g clipPath="url(#clip0_1_279)" id="Pagination">
          <circle cx="2.5" cy="2.5" fill="var(--fill-0, black)" fillOpacity="0.8" id="Selected" r="2.5" />
          <circle cx="12.5" cy="2.5" fill="var(--fill-0, black)" fillOpacity="0.2" id="Default" r="2.5" />
          <circle cx="22.5" cy="2.5" fill="var(--fill-0, black)" fillOpacity="0.2" id="Default_2" r="2.5" />
          <circle cx="32.5" cy="2.5" fill="var(--fill-0, black)" fillOpacity="0.2" id="Default_3" r="2.5" />
          <circle cx="42.5" cy="2.5" fill="var(--fill-0, black)" fillOpacity="0.2" id="Default_4" r="2.5" />
        </g>
        <defs>
          <clipPath id="clip0_1_279">
            <rect fill="white" height="5" width="45" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Banner() {
  return (
    <div className="content-stretch flex flex-col gap-[75px] items-center overflow-clip px-[112px] py-[6px] relative rounded-[8px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1)] shrink-0" data-name="Banner">
      <img alt="" className="absolute inset-0 max-w-none object-bottom pointer-events-none rounded-[8px] size-full" src={imgBanner} />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-black tracking-[-0.4px] w-[146px]">
        <p className="leading-[1.4]">Viva a USP</p>
      </div>
      <Pagination />
    </div>
  );
}

function NomeData() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] h-[44px] items-start justify-center leading-[0] min-w-px relative" data-name="Nome / Data">
      <div className="flex flex-col font-['Montserrat:Bold',sans-serif] font-bold h-[10px] justify-center max-h-[10px] overflow-hidden relative shrink-0 text-[15px] text-black text-ellipsis w-full">
        <p className="leading-[32px]">Lucas Aura</p>
      </div>
      <div className="flex flex-col font-['Montserrat:Regular',sans-serif] font-normal h-[8px] justify-center max-h-[8px] overflow-hidden relative shrink-0 text-[#848484] text-[12px] text-ellipsis w-full">
        <p className="leading-[32px]">@TheMostAura • 2 h</p>
      </div>
    </div>
  );
}

function User() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[10px] items-start min-w-px relative" data-name="User">
      <div className="h-[40px] relative rounded-[8px] shadow-[1px_1px_4px_0px_rgba(0,0,0,0.25)] shrink-0 w-[43.81px]" data-name="FotoPerfil">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[8px] size-full" src={imgFotoPerfil} />
      </div>
      <NomeData />
    </div>
  );
}

function Header() {
  return (
    <div className="content-stretch flex h-[44px] items-center justify-between relative shrink-0 w-full" data-name="Header">
      <User />
      <p className="[word-break:break-word] font-['Montserrat:Regular',sans-serif] font-normal leading-[32px] relative shrink-0 text-[#b8b8b8] text-[24px] text-center whitespace-nowrap">•••</p>
    </div>
  );
}

function Secundarios() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-w-px relative" data-name="Secundarios">
      <div className="h-[130px] relative shrink-0 w-full" data-name="image 22">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage22} />
      </div>
      <div className="flex-[1_0_0] min-h-px relative w-full" data-name="image 23">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage23} />
      </div>
    </div>
  );
}

function Fotos() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px overflow-clip relative w-full" data-name="Fotos">
      <div className="flex-[1_0_0] h-full min-w-px relative" data-name="Capa">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgCapa} />
      </div>
      <Secundarios />
    </div>
  );
}

function Body() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] h-[220px] items-start relative shrink-0 w-full" data-name="Body">
      <p className="[word-break:break-word] font-['Montserrat:Regular',sans-serif] font-normal leading-[0] overflow-hidden relative shrink-0 text-[16px] text-black text-ellipsis w-full whitespace-nowrap">
        <span className="leading-[10px]">{`Esteve em: `}</span>
        <span className="font-['Montserrat:Bold',sans-serif] font-bold leading-[10px] text-[#87d4e4]">Sexta do Rock</span>
      </p>
      <Fotos />
    </div>
  );
}

function Like() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Like">
      <div className="relative shrink-0 size-[24px]" data-name="Favorite">
        <div className="absolute inset-[4.17%_4.17%_12.5%_4.17%]">
          <div className="absolute inset-[14.29%_3.68%_-4.07%_3.68%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.3803 17.9567">
              <path d={svgPaths.pdcbc300} id="Vector 15" stroke="var(--stroke-0, #33363F)" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
      <p className="[word-break:break-word] font-['Montserrat:Regular',sans-serif] font-normal leading-[10px] relative shrink-0 text-[13px] text-black whitespace-nowrap">12</p>
    </div>
  );
}

function Cooments() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Cooments">
      <div className="relative shrink-0 size-[24px]" data-name="comment">
        <div className="absolute h-[15.364px] left-[4px] top-[5px] w-[16px]" data-name="Union">
          <div className="absolute inset-[-6.51%_-6.25%_-6.52%_-6.25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 17.366">
              <path d={svgPaths.p21c1e900} fill="var(--stroke-0, #222222)" id="Union" />
            </svg>
          </div>
        </div>
        <div className="absolute inset-[37.5%_33.33%_62.5%_33.33%]">
          <div className="absolute inset-[-1px_-12.5%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 2">
              <path d="M1 1H9" id="Vector 7" stroke="var(--stroke-0, #222222)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>
        <div className="absolute inset-[54.17%_45.83%_45.83%_33.33%]">
          <div className="absolute inset-[-1px_-20%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 2">
              <path d="M1 1L6 1" id="Vector 9" stroke="var(--stroke-0, #222222)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
      <p className="[word-break:break-word] font-['Montserrat:Regular',sans-serif] font-normal leading-[10px] relative shrink-0 text-[13px] text-black whitespace-nowrap">12</p>
    </div>
  );
}

function Footer() {
  return (
    <div className="content-stretch flex gap-[10px] h-[24px] items-center relative shrink-0 w-full" data-name="Footer">
      <Like />
      <Cooments />
    </div>
  );
}

function EventosSeguidos() {
  return (
    <div className="content-stretch drop-shadow-[0px_4px_2px_rgba(0,0,0,0.25)] flex flex-[1_0_0] flex-col gap-[16px] items-center min-h-px overflow-clip relative w-full" data-name="Eventos Seguidos">
      <div className="bg-white h-[144px] overflow-clip relative rounded-[8px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1)] shrink-0 w-[344px]" data-name="Card evento">
        <div className="absolute left-[11px] rounded-[8px] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)] size-[120px] top-[12px]" data-name="image 17">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[8px] size-full" src={imgImage17} />
        </div>
        <div className="absolute inset-[35.42%_52.33%_57.64%_44.77%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
            <path d={svgPaths.p33acd080} fill="var(--fill-0, black)" id="Vector" />
          </svg>
        </div>
        <div className="absolute bottom-[43.06%] left-[44.77%] right-[52.33%] top-1/2" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
            <path d={svgPaths.p1e309d80} fill="var(--fill-0, black)" id="Vector" />
          </svg>
        </div>
        <div className="absolute inset-[64.58%_52.33%_28.47%_44.77%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
            <path d={svgPaths.p700fdf0} fill="var(--fill-0, black)" id="Vector" />
          </svg>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] left-[147px] text-[24px] text-black top-[24px] whitespace-nowrap">
          <p className="leading-[32px]">matraca x</p>
        </div>
        <div className="-translate-x-full -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] left-[321px] text-[#87d4e4] text-[12px] text-right top-[119px] whitespace-nowrap">
          <p className="leading-[32px]">Gratuito</p>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] left-[168px] text-[12px] text-black top-[56px] whitespace-nowrap">
          <p className="leading-[32px]">ECA Jr.</p>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] left-[168px] text-[12px] text-black top-[77px] whitespace-nowrap">
          <p className="leading-[32px]">Vala da FAUD-USP</p>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] left-[168px] text-[12px] text-black top-[98px] whitespace-nowrap">
          <p className="leading-[32px]">{`07/08 - 09/08 `}</p>
        </div>
        <div className="absolute inset-[79.17%_52.33%_13.89%_44.77%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
            <path d={svgPaths.p53b6500} fill="var(--fill-0, black)" id="Vector" />
          </svg>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] left-[168px] text-[12px] text-black top-[119px] whitespace-nowrap">
          <p className="leading-[32px]">13:00 - 18:00</p>
        </div>
      </div>
      <div className="bg-white content-stretch flex flex-col gap-[10px] items-start overflow-clip p-[8px] relative rounded-[8px] shrink-0 w-[346px]" data-name="Post">
        <Header />
        <Body />
        <Footer />
      </div>
      <div className="bg-white h-[144px] overflow-clip relative rounded-[8px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1)] shrink-0 w-[344px]" data-name="Card evento">
        <div className="absolute left-[11px] rounded-[8px] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)] size-[120px] top-[12px]" data-name="image 17">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[8px] size-full" src={imgImage17} />
        </div>
        <div className="absolute inset-[35.42%_52.33%_57.64%_44.77%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
            <path d={svgPaths.p33acd080} fill="var(--fill-0, black)" id="Vector" />
          </svg>
        </div>
        <div className="absolute bottom-[43.06%] left-[44.77%] right-[52.33%] top-1/2" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
            <path d={svgPaths.p1e309d80} fill="var(--fill-0, black)" id="Vector" />
          </svg>
        </div>
        <div className="absolute inset-[64.58%_52.33%_28.47%_44.77%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
            <path d={svgPaths.p700fdf0} fill="var(--fill-0, black)" id="Vector" />
          </svg>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] left-[147px] text-[24px] text-black top-[24px] whitespace-nowrap">
          <p className="leading-[32px]">matraca x</p>
        </div>
        <div className="-translate-x-full -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] left-[321px] text-[#87d4e4] text-[12px] text-right top-[119px] whitespace-nowrap">
          <p className="leading-[32px]">Gratuito</p>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] left-[168px] text-[12px] text-black top-[56px] whitespace-nowrap">
          <p className="leading-[32px]">ECA Jr.</p>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] left-[168px] text-[12px] text-black top-[77px] whitespace-nowrap">
          <p className="leading-[32px]">Vala da FAUD-USP</p>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] left-[168px] text-[12px] text-black top-[98px] whitespace-nowrap">
          <p className="leading-[32px]">{`07/08 - 09/08 `}</p>
        </div>
        <div className="absolute inset-[79.17%_52.33%_13.89%_44.77%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
            <path d={svgPaths.p53b6500} fill="var(--fill-0, black)" id="Vector" />
          </svg>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] left-[168px] text-[12px] text-black top-[119px] whitespace-nowrap">
          <p className="leading-[32px]">13:00 - 18:00</p>
        </div>
      </div>
      <div className="bg-white h-[144px] overflow-clip relative rounded-[8px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1)] shrink-0 w-[344px]" data-name="Card evento">
        <div className="absolute left-[11px] rounded-[8px] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)] size-[120px] top-[12px]" data-name="image 17">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[8px] size-full" src={imgImage17} />
        </div>
        <div className="absolute inset-[35.42%_52.33%_57.64%_44.77%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
            <path d={svgPaths.p33acd080} fill="var(--fill-0, black)" id="Vector" />
          </svg>
        </div>
        <div className="absolute bottom-[43.06%] left-[44.77%] right-[52.33%] top-1/2" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
            <path d={svgPaths.p1e309d80} fill="var(--fill-0, black)" id="Vector" />
          </svg>
        </div>
        <div className="absolute inset-[64.58%_52.33%_28.47%_44.77%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
            <path d={svgPaths.p700fdf0} fill="var(--fill-0, black)" id="Vector" />
          </svg>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] left-[147px] text-[24px] text-black top-[24px] whitespace-nowrap">
          <p className="leading-[32px]">matraca x</p>
        </div>
        <div className="-translate-x-full -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] left-[321px] text-[#87d4e4] text-[12px] text-right top-[119px] whitespace-nowrap">
          <p className="leading-[32px]">Gratuito</p>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] left-[168px] text-[12px] text-black top-[56px] whitespace-nowrap">
          <p className="leading-[32px]">ECA Jr.</p>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] left-[168px] text-[12px] text-black top-[77px] whitespace-nowrap">
          <p className="leading-[32px]">Vala da FAUD-USP</p>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] left-[168px] text-[12px] text-black top-[98px] whitespace-nowrap">
          <p className="leading-[32px]">{`07/08 - 09/08 `}</p>
        </div>
        <div className="absolute inset-[79.17%_52.33%_13.89%_44.77%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
            <path d={svgPaths.p53b6500} fill="var(--fill-0, black)" id="Vector" />
          </svg>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] left-[168px] text-[12px] text-black top-[119px] whitespace-nowrap">
          <p className="leading-[32px]">13:00 - 18:00</p>
        </div>
      </div>
      <div className="bg-white h-[144px] overflow-clip relative rounded-[8px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1)] shrink-0 w-[344px]" data-name="Card evento">
        <div className="absolute left-[11px] rounded-[8px] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)] size-[120px] top-[12px]" data-name="image 17">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[8px] size-full" src={imgImage17} />
        </div>
        <div className="absolute inset-[35.42%_52.33%_57.64%_44.77%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
            <path d={svgPaths.p33acd080} fill="var(--fill-0, black)" id="Vector" />
          </svg>
        </div>
        <div className="absolute bottom-[43.06%] left-[44.77%] right-[52.33%] top-1/2" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
            <path d={svgPaths.p1e309d80} fill="var(--fill-0, black)" id="Vector" />
          </svg>
        </div>
        <div className="absolute inset-[64.58%_52.33%_28.47%_44.77%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
            <path d={svgPaths.p700fdf0} fill="var(--fill-0, black)" id="Vector" />
          </svg>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] left-[147px] text-[24px] text-black top-[24px] whitespace-nowrap">
          <p className="leading-[32px]">matraca x</p>
        </div>
        <div className="-translate-x-full -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] left-[321px] text-[#87d4e4] text-[12px] text-right top-[119px] whitespace-nowrap">
          <p className="leading-[32px]">Gratuito</p>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] left-[168px] text-[12px] text-black top-[56px] whitespace-nowrap">
          <p className="leading-[32px]">ECA Jr.</p>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] left-[168px] text-[12px] text-black top-[77px] whitespace-nowrap">
          <p className="leading-[32px]">Vala da FAUD-USP</p>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] left-[168px] text-[12px] text-black top-[98px] whitespace-nowrap">
          <p className="leading-[32px]">{`07/08 - 09/08 `}</p>
        </div>
        <div className="absolute inset-[79.17%_52.33%_13.89%_44.77%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
            <path d={svgPaths.p53b6500} fill="var(--fill-0, black)" id="Vector" />
          </svg>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] left-[168px] text-[12px] text-black top-[119px] whitespace-nowrap">
          <p className="leading-[32px]">13:00 - 18:00</p>
        </div>
      </div>
      <div className="bg-white h-[144px] overflow-clip relative rounded-[8px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1)] shrink-0 w-[344px]" data-name="Card evento">
        <div className="absolute left-[11px] rounded-[8px] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)] size-[120px] top-[12px]" data-name="image 17">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[8px] size-full" src={imgImage17} />
        </div>
        <div className="absolute inset-[35.42%_52.33%_57.64%_44.77%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
            <path d={svgPaths.p33acd080} fill="var(--fill-0, black)" id="Vector" />
          </svg>
        </div>
        <div className="absolute bottom-[43.06%] left-[44.77%] right-[52.33%] top-1/2" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
            <path d={svgPaths.p1e309d80} fill="var(--fill-0, black)" id="Vector" />
          </svg>
        </div>
        <div className="absolute inset-[64.58%_52.33%_28.47%_44.77%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
            <path d={svgPaths.p700fdf0} fill="var(--fill-0, black)" id="Vector" />
          </svg>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] left-[147px] text-[24px] text-black top-[24px] whitespace-nowrap">
          <p className="leading-[32px]">matraca x</p>
        </div>
        <div className="-translate-x-full -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] left-[321px] text-[#87d4e4] text-[12px] text-right top-[119px] whitespace-nowrap">
          <p className="leading-[32px]">Gratuito</p>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] left-[168px] text-[12px] text-black top-[56px] whitespace-nowrap">
          <p className="leading-[32px]">ECA Jr.</p>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] left-[168px] text-[12px] text-black top-[77px] whitespace-nowrap">
          <p className="leading-[32px]">Vala da FAUD-USP</p>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] left-[168px] text-[12px] text-black top-[98px] whitespace-nowrap">
          <p className="leading-[32px]">{`07/08 - 09/08 `}</p>
        </div>
        <div className="absolute inset-[79.17%_52.33%_13.89%_44.77%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
            <path d={svgPaths.p53b6500} fill="var(--fill-0, black)" id="Vector" />
          </svg>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] left-[168px] text-[12px] text-black top-[119px] whitespace-nowrap">
          <p className="leading-[32px]">13:00 - 18:00</p>
        </div>
      </div>
      <div className="bg-white h-[144px] overflow-clip relative rounded-[8px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1)] shrink-0 w-[344px]" data-name="Card evento">
        <div className="absolute left-[11px] rounded-[8px] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)] size-[120px] top-[12px]" data-name="image 17">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[8px] size-full" src={imgImage17} />
        </div>
        <div className="absolute inset-[35.42%_52.33%_57.64%_44.77%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
            <path d={svgPaths.p33acd080} fill="var(--fill-0, black)" id="Vector" />
          </svg>
        </div>
        <div className="absolute bottom-[43.06%] left-[44.77%] right-[52.33%] top-1/2" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
            <path d={svgPaths.p1e309d80} fill="var(--fill-0, black)" id="Vector" />
          </svg>
        </div>
        <div className="absolute inset-[64.58%_52.33%_28.47%_44.77%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
            <path d={svgPaths.p700fdf0} fill="var(--fill-0, black)" id="Vector" />
          </svg>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] left-[147px] text-[24px] text-black top-[24px] whitespace-nowrap">
          <p className="leading-[32px]">matraca x</p>
        </div>
        <div className="-translate-x-full -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] left-[321px] text-[#87d4e4] text-[12px] text-right top-[119px] whitespace-nowrap">
          <p className="leading-[32px]">Gratuito</p>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] left-[168px] text-[12px] text-black top-[56px] whitespace-nowrap">
          <p className="leading-[32px]">ECA Jr.</p>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] left-[168px] text-[12px] text-black top-[77px] whitespace-nowrap">
          <p className="leading-[32px]">Vala da FAUD-USP</p>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] left-[168px] text-[12px] text-black top-[98px] whitespace-nowrap">
          <p className="leading-[32px]">{`07/08 - 09/08 `}</p>
        </div>
        <div className="absolute inset-[79.17%_52.33%_13.89%_44.77%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
            <path d={svgPaths.p53b6500} fill="var(--fill-0, black)" id="Vector" />
          </svg>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] left-[168px] text-[12px] text-black top-[119px] whitespace-nowrap">
          <p className="leading-[32px]">13:00 - 18:00</p>
        </div>
      </div>
    </div>
  );
}

function IconTabHomeFill() {
  return (
    <div className="relative shrink-0 w-full" data-name="Icon_Tab/Home_Fill">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start px-px py-[2px] relative size-full">
          <div className="h-[19.687px] relative shrink-0 w-[22px]" data-name="home_fill">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 19.6871">
              <path clipRule="evenodd" d={svgPaths.p15137440} fill="var(--fill-0, black)" fillRule="evenodd" id="home_fill" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabBarItem() {
  return (
    <div className="bg-[#87d4e4] content-stretch flex flex-col items-start px-[26px] py-[3px] relative rounded-[8px] shrink-0 w-[76px]" data-name="Tab Bar Item">
      <IconTabHomeFill />
    </div>
  );
}

function IconSearch() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon/Search">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon/Search">
          <path d={svgPaths.p19568f00} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p2614b00} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function TabBarItem1() {
  return (
    <div className="content-stretch flex flex-col items-start px-[26px] py-[3px] relative rounded-[8px] shrink-0 w-[76px]" data-name="Tab Bar Item">
      <IconSearch />
    </div>
  );
}

function TabBarItem2() {
  return (
    <div className="content-stretch flex flex-col items-start px-[26px] py-[3px] relative rounded-[8px] shrink-0 w-[76px]" data-name="Tab Bar Item">
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icon_Tab/Discover">
        <div className="absolute inset-[4.17%]" data-name="discover">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
            <g id="discover">
              <path clipRule="evenodd" d={svgPaths.p2370ec00} fill="black" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p368ed00} fill="black" fillRule="evenodd" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function TabBarItem3() {
  return (
    <div className="content-stretch flex flex-col items-start px-[26px] py-[3px] relative rounded-[8px] shrink-0 w-[76px]" data-name="Tab Bar Item">
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icon/Person">
        <div className="absolute inset-[8.33%_14.58%_6.25%_14.58%]" data-name="person">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 20.5">
            <path d={svgPaths.p10d2bd00} fill="var(--fill-0, black)" id="person" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function TabBarItem4() {
  return (
    <div className="h-[30px] relative shrink-0 w-[76px]" data-name="Tab Bar Item">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 76 30">
        <g id="Tab Bar Item">
          <path d={svgPaths.p3adf6ec0} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Tabs() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex items-center left-1/2 overflow-clip px-[6px] py-[5px] rounded-[8px] top-[2px] w-[390px]" data-name="Tabs">
      <TabBarItem />
      <TabBarItem1 />
      <TabBarItem2 />
      <TabBarItem3 />
      <TabBarItem4 />
    </div>
  );
}

function TabBar() {
  return (
    <div className="backdrop-blur-[10px] bg-white drop-shadow-[0px_-0.5px_0px_rgba(0,0,0,0.1)] h-[61px] relative shrink-0 w-full" data-name="Tab Bar">
      <Tabs />
      <div className="-translate-x-1/2 absolute bg-black bottom-[13px] h-[5px] left-1/2 rounded-[100px] w-[134px]" data-name="Home Indicator" />
    </div>
  );
}

export default function Home() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[8px] items-center justify-center relative size-full" data-name="Home">
      <StatusBar />
      <Frame />
      <Banner />
      <EventosSeguidos />
      <TabBar />
    </div>
  );
}