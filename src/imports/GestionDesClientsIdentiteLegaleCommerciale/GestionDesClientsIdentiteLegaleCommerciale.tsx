import svgPaths from "./svg-1u2yb8hdjl";
import imgImage1 from "./da8e68b134895af709a262e8dd58767788d0542c.png";

function Container() {
  return (
    <div className="absolute bg-white border border-[#d9d9d9] border-solid h-[40px] left-[356px] rounded-[8px] top-[280px] w-[481px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-[11px] not-italic text-[16px] text-[rgba(0,0,0,0.25)] top-[7px] tracking-[-0.3125px] whitespace-nowrap">Sélectionnez un pays</p>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[356px] top-[252px]">
      <Container />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[0] left-[362.76px] not-italic text-[#e3262f] text-[14px] top-[252px] tracking-[-0.1504px] w-[181.361px]">
        <span className="leading-[22px]">*</span>
        <span className="leading-[22px] text-[rgba(0,0,0,0.88)]">{` Pays d'immatriculation`}</span>
      </p>
    </div>
  );
}

function ClientForm() {
  return (
    <div className="absolute h-[22px] left-[9.45px] top-0 w-[103.922px]" data-name="ClientForm">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[0] left-0 not-italic text-[#e3262f] text-[14px] top-0 tracking-[-0.1504px] whitespace-nowrap">
        <span className="leading-[22px]">*</span>
        <span className="leading-[22px] text-[rgba(0,0,0,0.88)]">{` Raison Sociale`}</span>
      </p>
    </div>
  );
}

function FormItemLabel() {
  return (
    <div className="h-[22px] relative shrink-0 w-full" data-name="FormItemLabel">
      <ClientForm />
    </div>
  );
}

function Col() {
  return (
    <div className="absolute h-[30px] left-0 top-0 w-[1003px]" data-name="Col">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pr-[1158.609px] relative size-full">
          <FormItemLabel />
        </div>
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[16px] text-[rgba(0,0,0,0.45)] top-0 tracking-[-0.3125px] whitespace-nowrap">0 / 100</p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="absolute content-stretch flex h-[24px] items-center left-[1223.66px] top-[7px] w-[49.344px]" data-name="Text">
      <Text2 />
    </div>
  );
}

function TextInput() {
  return (
    <div className="absolute content-stretch flex h-[24px] items-center left-[11px] overflow-clip top-[7px] w-[1208.656px]" data-name="Text Input">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(0,0,0,0.25)] tracking-[-0.3125px] whitespace-nowrap">Ex: DECATHLON FRANCE SAS</p>
    </div>
  );
}

function Text() {
  return (
    <div className="absolute bg-white border border-[#d9d9d9] border-solid h-[40px] left-0 rounded-[8px] top-0 w-[1003px]" data-name="Text">
      <Text1 />
      <TextInput />
    </div>
  );
}

function FormItemInput() {
  return (
    <div className="absolute h-[40px] left-0 top-[30px] w-[1286px]" data-name="FormItemInput">
      <Text />
    </div>
  );
}

function Row() {
  return (
    <div className="absolute h-[70px] left-[356px] top-[168px] w-[1004px]" data-name="Row">
      <Col />
      <FormItemInput />
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p33f6b680} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M15.8333 10H4.16667" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text3() {
  return (
    <div className="flex-[1_0_0] h-[21px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Decathlon_Text:Medium',sans-serif] leading-[21px] left-[24px] not-italic text-[14px] text-center text-white top-0 whitespace-nowrap">Retour</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[21px] items-center left-[24px] top-[24px] w-[75.844px]" data-name="Button">
      <Icon />
      <Text3 />
    </div>
  );
}

function Container4() {
  return (
    <div className="bg-white relative rounded-[16777200px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Decathlon_Text:SemiBold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#3643ba] text-[16px] whitespace-nowrap">1</p>
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[42px] relative shrink-0 w-[118.664px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Decathlon_Text:Medium',sans-serif] leading-[21px] left-0 not-italic text-[14px] text-white top-0 w-[119px]">{`Identité Légale & Commerciale`}</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[rgba(255,255,255,0.2)] h-[74px] relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center pl-[16px] relative size-full">
          <Container4 />
          <Text4 />
        </div>
      </div>
    </div>
  );
}

function Container6() {
  return <div className="bg-[rgba(255,255,255,0.2)] h-[32px] shrink-0 w-[2px]" data-name="Container" />;
}

function Container5() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-start justify-center pt-[8px] px-[135px] relative size-full">
          <Container6 />
        </div>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col h-[122px] items-start relative shrink-0 w-full" data-name="Container">
      <Button1 />
      <Container5 />
    </div>
  );
}

function Container8() {
  return (
    <div className="bg-[rgba(255,255,255,0.2)] relative rounded-[16777200px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Decathlon_Text:SemiBold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">2</p>
      </div>
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[42px] relative shrink-0 w-[171.953px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Decathlon_Text:Medium',sans-serif] leading-[21px] left-0 not-italic text-[14px] text-white top-0 w-[172px]">{`Paramètres Financiers & Comptables`}</p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="h-[74px] relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center pl-[16px] relative size-full">
          <Container8 />
          <Text5 />
        </div>
      </div>
    </div>
  );
}

function Container10() {
  return <div className="bg-[rgba(255,255,255,0.2)] h-[32px] shrink-0 w-[2px]" data-name="Container" />;
}

function Container9() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-start justify-center pt-[8px] px-[135px] relative size-full">
          <Container10 />
        </div>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col h-[122px] items-start relative shrink-0 w-full" data-name="Container">
      <Button2 />
      <Container9 />
    </div>
  );
}

function Container12() {
  return (
    <div className="bg-[rgba(255,255,255,0.2)] relative rounded-[16777200px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Decathlon_Text:SemiBold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">3</p>
      </div>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[21px] relative shrink-0 w-[171px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Decathlon_Text:Medium',sans-serif] leading-[21px] left-0 not-italic text-[14px] text-white top-0 whitespace-nowrap">{`Justificatifs & Validation`}</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="h-[72px] relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center pl-[16px] relative size-full">
          <Container12 />
          <Text6 />
        </div>
      </div>
    </div>
  );
}

function Container14() {
  return <div className="bg-[rgba(255,255,255,0.2)] h-[32px] shrink-0 w-[2px]" data-name="Container" />;
}

function Container13() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-start justify-center pt-[8px] px-[135px] relative size-full">
          <Container14 />
        </div>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col h-[120px] items-start relative shrink-0 w-full" data-name="Container">
      <Button3 />
      <Container13 />
    </div>
  );
}

function Container15() {
  return (
    <div className="bg-[rgba(255,255,255,0.2)] h-[40px] relative rounded-[16777200px] shrink-0 w-[39.102px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Decathlon_Text:SemiBold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">4</p>
      </div>
    </div>
  );
}

function Text7() {
  return (
    <div className="flex-[1_0_0] h-[42px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Decathlon_Text:Medium',sans-serif] leading-[21px] left-0 not-italic text-[14px] text-white top-0 w-[96px]">Historique de modification</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="h-[74px] relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center px-[16px] relative size-full">
          <Container15 />
          <Text7 />
        </div>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[462px] items-start left-[24px] top-[85px] w-[272px]" data-name="Container">
      <Container3 />
      <Container7 />
      <Container11 />
      <Button4 />
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute bg-[#3643ba] h-[1422px] left-0 top-[139px] w-[320px]" data-name="Container">
      <Button />
      <Container2 />
    </div>
  );
}

function P() {
  return (
    <div className="-translate-x-1/2 absolute bg-[#3643ba] content-stretch flex font-['Decathlon_Text:Regular',sans-serif] gap-[20px] items-center leading-[18px] left-1/2 not-italic px-[323px] py-[16px] text-[12px] text-white top-[1559px] w-[1440px] whitespace-nowrap" data-name="p">
      <p className="relative shrink-0">{`Lift évolue ! Cette application est en cours de développement (MVP). Vos retours sont précieux pour nous aider à l'améliorer.`}</p>
      <p className="relative shrink-0">V0.0</p>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[42.35%_12.5%_29.41%_85.83%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Group">
          <path d={svgPaths.p21e34100} fill="var(--fill-0, #3643BA)" id="Vector" />
          <path d={svgPaths.p615a700} fill="var(--fill-0, #3643BA)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Calque() {
  return (
    <div className="absolute contents inset-[42.35%_12.5%_29.41%_85.83%]" data-name="Calque 1">
      <Group />
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex items-center justify-between min-h-[48px] relative shrink-0 w-full" data-name="Container">
      <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Logo with name">
        <div className="flex flex-row items-center size-full">
          <div className="content-center flex flex-wrap gap-[8px] items-center pr-[32px] relative w-full">
            <div className="h-[28px] overflow-clip relative shrink-0 w-[187.6px]" data-name="Decathlon logo DIGITAL">
              <div className="absolute inset-[0_0.42%_0_0.35%]" data-name="Vector">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 186.16 28">
                  <g id="Vector">
                    <path d={svgPaths.p1c8976a0} fill="var(--fill-0, #3643BA)" />
                    <path d={svgPaths.p2f960740} fill="var(--fill-0, #3643BA)" />
                  </g>
                </svg>
              </div>
            </div>
            <div className="flex flex-col font-['Decathlon_Display:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#101010] text-[26px] whitespace-nowrap">
              <p className="whitespace-pre">
                <span className="leading-[1.231]">{`                 `}</span>
                <span className="leading-[1.231] text-[#101010]">Lift</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-[1_0_0] gap-[4px] items-center justify-end min-h-px min-w-px relative" data-name=".End actions">
        <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center relative rounded-[999px] shrink-0 size-[48px]" data-name="↪️ End action">
          <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icon">
            <div className="absolute left-[2px] size-[20px] top-[2px]" data-name="Vector">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                <path d={svgPaths.p36ff6200} fill="var(--fill-0, #101010)" id="Vector" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center relative rounded-[999px] shrink-0 size-[48px]" data-name="↪️ End action">
          <div className="relative shrink-0 size-[24px]" data-name="Icon">
            <div className="absolute inset-[8.54%_17.71%_8.33%_17.71%]" data-name="Vector">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.5 19.95">
                <path clipRule="evenodd" d={svgPaths.p1ac0e600} fill="var(--fill-0, #101010)" fillRule="evenodd" id="Vector" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Top() {
  return (
    <div className="absolute content-stretch flex flex-col inset-[28.24%_4.44%_15.29%_4.44%] items-center" data-name="Top">
      <Container16 />
    </div>
  );
}

function Span() {
  return (
    <div className="h-[21px] relative shrink-0 w-[120px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Decathlon_Text:Medium',sans-serif] leading-[21px] left-0 not-italic text-[#616161] text-[14px] top-0 whitespace-nowrap">Gestion des tiers</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="absolute content-stretch flex flex-col h-[53px] items-center justify-center left-[320px] px-[20px] top-[86px] w-[191.742px]" data-name="Link">
      <Span />
    </div>
  );
}

function Span1() {
  return (
    <div className="h-[21px] relative shrink-0 w-[136px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Decathlon_Text:Medium',sans-serif] leading-[21px] left-0 not-italic text-[#3643ba] text-[14px] top-0 whitespace-nowrap">Gestion des clients</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="absolute content-stretch flex h-[53px] items-center justify-center left-[515.74px] px-[20px] top-[86px] w-[207.875px]" data-name="Link">
      <Span1 />
    </div>
  );
}

function Span2() {
  return (
    <div className="h-[21px] relative shrink-0 w-[103px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Decathlon_Text:Medium',sans-serif] leading-[21px] left-0 not-italic text-[#616161] text-[14px] top-0 whitespace-nowrap">Mes brouillons</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="absolute content-stretch flex h-[53px] items-center justify-center left-[727.62px] px-[20px] top-[86px] w-[175.563px]" data-name="Link">
      <Span2 />
    </div>
  );
}

function Span3() {
  return (
    <div className="h-[21px] relative shrink-0 w-[156px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Decathlon_Text:Medium',sans-serif] leading-[21px] left-0 not-italic text-[#616161] text-[14px] top-0 whitespace-nowrap">Exporter de la donnée</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="absolute content-stretch flex h-[53px] items-center justify-center left-[907.18px] px-[20px] top-[86px] w-[227.461px]" data-name="Link">
      <Span3 />
    </div>
  );
}

function Div() {
  return <div className="absolute bg-[#3643ba] h-px left-[530px] top-[139px] w-[192px]" data-name="div" />;
}

function ClientForm1() {
  return (
    <div className="absolute h-[22px] left-[9.45px] top-0 w-[141.563px]" data-name="ClientForm">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[0] left-0 not-italic text-[#e3262f] text-[14px] top-0 tracking-[-0.1504px] whitespace-nowrap">
        <span className="leading-[22px]">*</span>
        <span className="leading-[22px] text-[rgba(0,0,0,0.88)]">{` Legal ID (Siren, etc.)`}</span>
      </p>
    </div>
  );
}

function IconReact() {
  return (
    <div className="absolute left-0 size-[14px] top-0" data-name="IconReact">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_1_4470)" id="IconReact">
          <path d={svgPaths.p2ddbee00} fill="var(--fill-0, black)" fillOpacity="0.45" id="Vector" />
          <path d={svgPaths.p1efee500} fill="var(--fill-0, black)" fillOpacity="0.45" id="Vector_2" />
        </g>
        <defs>
          <clipPath id="clip0_1_4470">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function AntdIcon() {
  return (
    <div className="absolute left-[155.02px] size-[14px] top-[3.75px]" data-name="AntdIcon">
      <IconReact />
    </div>
  );
}

function FormItemLabel1() {
  return (
    <div className="h-[22px] relative shrink-0 w-full" data-name="FormItemLabel">
      <ClientForm1 />
      <AntdIcon />
    </div>
  );
}

function Col1() {
  return (
    <div className="absolute content-stretch flex flex-col h-[30px] items-start left-0 overflow-clip pr-[447.969px] top-0 w-[631px]" data-name="Col">
      <FormItemLabel1 />
    </div>
  );
}

function TextInput1() {
  return (
    <div className="absolute bg-white h-[40px] left-0 rounded-[8px] top-0 w-[480px]" data-name="Text Input">
      <div className="content-stretch flex items-center overflow-clip px-[11px] py-[7px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(0,0,0,0.25)] tracking-[-0.3125px] whitespace-nowrap">Ex: 310 762 904</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function FormItemInput1() {
  return (
    <div className="absolute h-[40px] left-0 top-[30px] w-[480px]" data-name="FormItemInput">
      <TextInput1 />
    </div>
  );
}

function Row1() {
  return (
    <div className="absolute h-[70px] left-[877px] top-[250px] w-[480px]" data-name="Row">
      <Col1 />
      <FormItemInput1 />
    </div>
  );
}

function Container17() {
  return (
    <div className="h-px relative shrink-0 w-[61.469px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#3643ba] border-solid border-t inset-0 pointer-events-none" />
    </div>
  );
}

function Text8() {
  return (
    <div className="h-[22px] relative shrink-0 w-[56.438px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Decathlon_Text:Medium',sans-serif] leading-[22px] left-[28.5px] not-italic text-[#3643ba] text-[14px] text-center top-0 whitespace-nowrap">TVA</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="flex-[1_0_0] h-px min-h-px min-w-px relative" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#3643ba] border-solid border-t inset-0 pointer-events-none" />
    </div>
  );
}

function Divider() {
  return (
    <div className="absolute content-stretch flex h-[22px] items-center left-[356px] top-[355px] w-[1001px]" data-name="Divider">
      <Container17 />
      <Text8 />
      <Container18 />
    </div>
  );
}

function Container19() {
  return (
    <div className="h-px relative shrink-0 w-[61.469px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#3643ba] border-solid border-t inset-0 pointer-events-none" />
    </div>
  );
}

function Text9() {
  return (
    <div className="h-[22px] relative shrink-0 w-[124px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Decathlon_Text:Medium',sans-serif] leading-[22px] left-[62.03px] not-italic text-[#3643ba] text-[14px] text-center top-0 whitespace-nowrap">Coordonnées</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="h-0 relative shrink-0 w-[810px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#3643ba] border-solid border-t inset-0 pointer-events-none" />
    </div>
  );
}

function Divider1() {
  return (
    <div className="absolute content-stretch flex h-[22px] items-center left-[356px] top-[663px] w-[1001px]" data-name="Divider">
      <Container19 />
      <Text9 />
      <Container20 />
    </div>
  );
}

function Container21() {
  return (
    <div className="h-px relative shrink-0 w-[61.469px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#3643ba] border-solid border-t inset-0 pointer-events-none" />
    </div>
  );
}

function Text10() {
  return (
    <div className="h-[22px] relative shrink-0 w-[124px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Decathlon_Text:Medium',sans-serif] leading-[22px] left-[62.03px] not-italic text-[#3643ba] text-[14px] text-center top-0 whitespace-nowrap">Coordonnées</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="h-0 relative shrink-0 w-[810px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#3643ba] border-solid border-t inset-0 pointer-events-none" />
    </div>
  );
}

function Divider2() {
  return (
    <div className="absolute content-stretch flex h-[22px] items-center left-[356px] top-[505px] w-[1001px]" data-name="Divider">
      <Container21 />
      <Text10 />
      <Container22 />
    </div>
  );
}

function ClientForm2() {
  return (
    <div className="absolute h-[22px] left-[9.45px] top-0 w-[122.266px]" data-name="ClientForm">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[0] left-0 not-italic text-[#e3262f] text-[14px] top-0 tracking-[-0.1504px] whitespace-nowrap">
        <span className="leading-[22px]">*</span>
        <span className="leading-[22px] text-[rgba(0,0,0,0.88)]">{` Assujetti à la TVA`}</span>
      </p>
    </div>
  );
}

function FormItemLabel2() {
  return (
    <div className="h-[22px] relative shrink-0 w-full" data-name="FormItemLabel">
      <ClientForm2 />
    </div>
  );
}

function Col2() {
  return (
    <div className="absolute h-[30px] left-0 top-0 w-[139px]" data-name="Col">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pr-[1140.266px] relative size-full">
          <FormItemLabel2 />
        </div>
      </div>
    </div>
  );
}

function HandleShape() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center overflow-clip p-[11px] relative rounded-[24px] shrink-0 size-[24px]" data-name="Handle shape">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[16px] top-1/2" data-name="Icon">
        <div className="absolute inset-[25.85%_14.19%_22.54%_14.18%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.4607 8.25766">
            <path clipRule="evenodd" d={svgPaths.p356fba00} fill="var(--fill-0, #3643BA)" fillRule="evenodd" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function StateLayer() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[100px] shrink-0" data-name="State-layer">
      <HandleShape />
    </div>
  );
}

function Target() {
  return (
    <div className="-translate-y-1/2 absolute content-stretch flex items-center justify-center p-[4px] right-[-12px] top-1/2" data-name="Target">
      <StateLayer />
    </div>
  );
}

function Handle() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Handle">
      <Target />
    </div>
  );
}

function Row2() {
  return (
    <div className="absolute h-[70px] left-[357px] top-[407px] w-[139px]" data-name="Row">
      <Col2 />
      <button className="absolute bg-[#3643ba] content-stretch cursor-pointer flex h-[32px] items-center justify-end left-[19px] px-[4px] py-[2px] rounded-[100px] top-[30px] w-[52px]" data-name="[Android only] Switch (Toggle)">
        <Handle />
      </button>
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute bg-white border border-[#d9d9d9] border-solid h-[40px] left-[628px] rounded-[8px] top-[435px] w-[729px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-[11px] not-italic text-[16px] text-[rgba(0,0,0,0.25)] top-[7px] tracking-[-0.3125px] whitespace-nowrap">Ex: FR12345678901</p>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents left-[628px] top-[407px]">
      <Container23 />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[0] left-[635px] not-italic text-[#e3262f] text-[14px] top-[407px] tracking-[-0.1504px] w-[253px]">
        <span className="leading-[22px]">*</span>
        <span className="leading-[22px] text-[rgba(0,0,0,0.88)]">{` Numéro de TVA intracommunautaire`}</span>
      </p>
    </div>
  );
}

function ClientForm4() {
  return (
    <div className="absolute h-[22px] left-[9.45px] top-0 w-[100.828px]" data-name="ClientForm">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[0] left-0 not-italic text-[#e3262f] text-[14px] top-0 tracking-[-0.1504px] whitespace-nowrap">
        <span className="leading-[22px]">*</span>
        <span className="leading-[22px] text-[rgba(0,0,0,0.88)]">{` Type de client`}</span>
      </p>
    </div>
  );
}

function IconReact1() {
  return (
    <div className="absolute left-0 size-[14px] top-0" data-name="IconReact">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_1_4470)" id="IconReact">
          <path d={svgPaths.p2ddbee00} fill="var(--fill-0, black)" fillOpacity="0.45" id="Vector" />
          <path d={svgPaths.p1efee500} fill="var(--fill-0, black)" fillOpacity="0.45" id="Vector_2" />
        </g>
        <defs>
          <clipPath id="clip0_1_4470">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function AntdIcon1() {
  return (
    <div className="absolute left-[114.28px] size-[14px] top-[3.75px]" data-name="AntdIcon">
      <IconReact1 />
    </div>
  );
}

function FormItemLabel3() {
  return (
    <div className="h-[22px] relative shrink-0 w-full" data-name="FormItemLabel">
      <ClientForm4 />
      <AntdIcon1 />
    </div>
  );
}

function Col3() {
  return (
    <div className="absolute content-stretch flex flex-col h-[30px] items-start left-0 overflow-clip pr-[270.359px] top-0 w-[412.656px]" data-name="Col">
      <FormItemLabel3 />
    </div>
  );
}

function IconReact2() {
  return (
    <div className="absolute left-0 size-[12px] top-0" data-name="IconReact">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="IconReact">
          <path d={svgPaths.pc04cd00} fill="var(--fill-0, black)" fillOpacity="0.25" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function AntdIcon2() {
  return (
    <div className="absolute left-[217.66px] size-[12px] top-[13px]" data-name="AntdIcon">
      <IconReact2 />
    </div>
  );
}

function SearchInput() {
  return <div className="absolute h-[24px] left-0 top-0 w-[370.656px]" data-name="Search Input" />;
}

function Placeholder() {
  return (
    <div className="absolute h-[24px] left-0 overflow-clip top-0 w-[93.547px]" data-name="Placeholder">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[16px] text-[rgba(0,0,0,0.25)] top-0 tracking-[-0.3125px] whitespace-nowrap">Sélectionnez</p>
    </div>
  );
}

function Container25() {
  return (
    <div className="absolute h-[24px] left-[11px] overflow-clip top-[7px] w-[370.656px]" data-name="Container">
      <SearchInput />
      <Placeholder />
    </div>
  );
}

function Container24() {
  return (
    <div className="absolute bg-white border border-[#d9d9d9] border-solid h-[40px] left-0 rounded-[8px] top-0 w-[242px]" data-name="Container">
      <AntdIcon2 />
      <Container25 />
    </div>
  );
}

function FormItemInput2() {
  return (
    <div className="absolute h-[40px] left-0 top-[30px] w-[412.656px]" data-name="FormItemInput">
      <Container24 />
    </div>
  );
}

function Row3() {
  return (
    <div className="absolute h-[70px] left-0 top-0 w-[412.656px]" data-name="Row">
      <Col3 />
      <FormItemInput2 />
    </div>
  );
}

function IconReact3() {
  return (
    <div className="absolute left-0 size-[14px] top-0" data-name="IconReact">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_1_4470)" id="IconReact">
          <path d={svgPaths.p2ddbee00} fill="var(--fill-0, black)" fillOpacity="0.45" id="Vector" />
          <path d={svgPaths.p1efee500} fill="var(--fill-0, black)" fillOpacity="0.45" id="Vector_2" />
        </g>
        <defs>
          <clipPath id="clip0_1_4470">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function AntdIcon3() {
  return (
    <div className="absolute left-[110.63px] size-[14px] top-[3.75px]" data-name="AntdIcon">
      <IconReact3 />
    </div>
  );
}

function FormItemLabel4() {
  return (
    <div className="h-[22px] relative shrink-0 w-full" data-name="FormItemLabel">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[22px] left-0 not-italic text-[14px] text-[rgba(0,0,0,0.88)] top-0 tracking-[-0.1504px] whitespace-nowrap">Customer Group</p>
      <AntdIcon3 />
    </div>
  );
}

function Col4() {
  return (
    <div className="absolute content-stretch flex flex-col h-[30px] items-start left-0 overflow-clip pr-[274.031px] top-0 w-[412.672px]" data-name="Col">
      <FormItemLabel4 />
    </div>
  );
}

function IconReact4() {
  return (
    <div className="absolute left-0 size-[12px] top-0" data-name="IconReact">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="IconReact">
          <path d={svgPaths.pc04cd00} fill="var(--fill-0, black)" fillOpacity="0.25" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function AntdIcon4() {
  return (
    <div className="absolute left-[287.67px] size-[12px] top-[13px]" data-name="AntdIcon">
      <IconReact4 />
    </div>
  );
}

function SearchInput1() {
  return <div className="absolute h-[24px] left-0 top-0 w-[370.672px]" data-name="Search Input" />;
}

function Placeholder1() {
  return (
    <div className="absolute h-[24px] left-0 overflow-clip top-0 w-[93.547px]" data-name="Placeholder">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[16px] text-[rgba(0,0,0,0.25)] top-0 tracking-[-0.3125px] whitespace-nowrap">Sélectionnez</p>
    </div>
  );
}

function Container27() {
  return (
    <div className="absolute h-[24px] left-[11px] overflow-clip top-[7px] w-[370.672px]" data-name="Container">
      <SearchInput1 />
      <Placeholder1 />
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute bg-white border border-[#d9d9d9] border-solid h-[40px] left-0 rounded-[8px] top-0 w-[313px]" data-name="Container">
      <AntdIcon4 />
      <Container27 />
    </div>
  );
}

function FormItemInput3() {
  return (
    <div className="absolute h-[40px] left-0 top-[30px] w-[412.672px]" data-name="FormItemInput">
      <Container26 />
    </div>
  );
}

function Row4() {
  return (
    <div className="absolute h-[70px] left-[272px] top-0 w-[412.672px]" data-name="Row">
      <Col4 />
      <FormItemInput3 />
    </div>
  );
}

function ClientForm5() {
  return (
    <div className="absolute h-[22px] left-[9.45px] top-0 w-[53.844px]" data-name="ClientForm">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[0] left-0 not-italic text-[#e3262f] text-[14px] top-0 tracking-[-0.1504px] whitespace-nowrap">
        <span className="leading-[22px]">*</span>
        <span className="leading-[22px] text-[rgba(0,0,0,0.88)]">{` Nature`}</span>
      </p>
    </div>
  );
}

function IconReact5() {
  return (
    <div className="absolute left-0 size-[14px] top-0" data-name="IconReact">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_1_4470)" id="IconReact">
          <path d={svgPaths.p2ddbee00} fill="var(--fill-0, black)" fillOpacity="0.45" id="Vector" />
          <path d={svgPaths.p1efee500} fill="var(--fill-0, black)" fillOpacity="0.45" id="Vector_2" />
        </g>
        <defs>
          <clipPath id="clip0_1_4470">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function AntdIcon5() {
  return (
    <div className="absolute left-[67.3px] size-[14px] top-[3.75px]" data-name="AntdIcon">
      <IconReact5 />
    </div>
  );
}

function FormItemLabel5() {
  return (
    <div className="h-[22px] relative shrink-0 w-full" data-name="FormItemLabel">
      <ClientForm5 />
      <AntdIcon5 />
    </div>
  );
}

function Col5() {
  return (
    <div className="absolute content-stretch flex flex-col h-[30px] items-start left-0 overflow-clip pr-[317.344px] top-0 w-[412.656px]" data-name="Col">
      <FormItemLabel5 />
    </div>
  );
}

function IconReact6() {
  return (
    <div className="absolute left-0 size-[12px] top-0" data-name="IconReact">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="IconReact">
          <path d={svgPaths.pc04cd00} fill="var(--fill-0, black)" fillOpacity="0.25" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function AntdIcon6() {
  return (
    <div className="absolute left-[357.66px] size-[12px] top-[13px]" data-name="AntdIcon">
      <IconReact6 />
    </div>
  );
}

function SearchInput2() {
  return <div className="absolute h-[24px] left-0 top-0 w-[370.656px]" data-name="Search Input" />;
}

function Placeholder2() {
  return (
    <div className="absolute h-[24px] left-0 overflow-clip top-0 w-[93.547px]" data-name="Placeholder">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[16px] text-[rgba(0,0,0,0.25)] top-0 tracking-[-0.3125px] whitespace-nowrap">Sélectionnez</p>
    </div>
  );
}

function Container29() {
  return (
    <div className="absolute h-[24px] left-[11px] overflow-clip top-[7px] w-[370.656px]" data-name="Container">
      <SearchInput2 />
      <Placeholder2 />
    </div>
  );
}

function Container28() {
  return (
    <div className="absolute bg-white border border-[#d9d9d9] border-solid h-[40px] left-0 rounded-[8px] top-0 w-[383px]" data-name="Container">
      <AntdIcon6 />
      <Container29 />
    </div>
  );
}

function FormItemInput4() {
  return (
    <div className="absolute h-[40px] left-0 top-[30px] w-[412.656px]" data-name="FormItemInput">
      <Container28 />
    </div>
  );
}

function Row5() {
  return (
    <div className="absolute h-[70px] left-[615px] top-0 w-[412.656px]" data-name="Row">
      <Col5 />
      <FormItemInput4 />
    </div>
  );
}

function ClientForm3() {
  return (
    <div className="absolute h-[94px] left-[356px] top-[556px] w-[1286px]" data-name="ClientForm">
      <Row3 />
      <Row4 />
      <Row5 />
    </div>
  );
}

function ClientForm6() {
  return (
    <div className="absolute h-[22px] left-[9.45px] top-0 w-[136.203px]" data-name="ClientForm">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[0] left-0 not-italic text-[#e3262f] text-[14px] top-0 tracking-[-0.1504px] whitespace-nowrap">
        <span className="leading-[22px]">*</span>
        <span className="leading-[22px] text-[rgba(0,0,0,0.88)]">{` Téléphone principal`}</span>
      </p>
    </div>
  );
}

function FormItemLabel6() {
  return (
    <div className="h-[22px] relative shrink-0 w-full" data-name="FormItemLabel">
      <ClientForm6 />
    </div>
  );
}

function Col6() {
  return (
    <div className="absolute content-stretch flex flex-col h-[30px] items-start left-0 overflow-clip pr-[1126.328px] top-0 w-[1286px]" data-name="Col">
      <FormItemLabel6 />
    </div>
  );
}

function IconReact7() {
  return (
    <div className="absolute left-0 size-[12px] top-0" data-name="IconReact">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="IconReact">
          <path d={svgPaths.pc04cd00} fill="var(--fill-0, black)" fillOpacity="0.25" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function AntdIcon7() {
  return (
    <div className="absolute left-[115px] size-[12px] top-[13px]" data-name="AntdIcon">
      <IconReact7 />
    </div>
  );
}

function SearchInput3() {
  return <div className="absolute h-[24px] left-0 top-0 w-[98px]" data-name="Search Input" />;
}

function Container31() {
  return (
    <div className="absolute h-[24px] left-[11px] overflow-clip top-[7px] w-[98px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[16px] text-[rgba(0,0,0,0.88)] top-0 tracking-[-0.3125px] whitespace-nowrap">🇫🇷 +33</p>
      <SearchInput3 />
    </div>
  );
}

function Container30() {
  return (
    <div className="absolute bg-white border border-[#d9d9d9] border-solid h-[40px] left-0 rounded-bl-[8px] rounded-tl-[8px] top-0 w-[140px]" data-name="Container">
      <AntdIcon7 />
      <Container31 />
    </div>
  );
}

function TextInput2() {
  return (
    <div className="absolute bg-white h-[40px] left-[139px] rounded-br-[8px] rounded-tr-[8px] top-0 w-[305px]" data-name="Text Input">
      <div className="content-stretch flex items-center overflow-clip px-[11px] py-[7px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(0,0,0,0.25)] tracking-[-0.3125px] whitespace-nowrap">6 12 34 56 78</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-br-[8px] rounded-tr-[8px]" />
    </div>
  );
}

function Compact() {
  return (
    <div className="flex-[1_0_0] h-[40px] min-h-px min-w-px relative" data-name="Compact">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container30 />
        <TextInput2 />
      </div>
    </div>
  );
}

function FormItemInput5() {
  return (
    <div className="absolute content-stretch flex h-[40px] items-center left-0 top-[30px] w-[994px]" data-name="FormItemInput">
      <Compact />
    </div>
  );
}

function Container32() {
  return (
    <div className="absolute bg-white border border-[#d9d9d9] border-solid h-[40px] left-[484px] rounded-[8px] top-[30px] w-[514px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-[11px] not-italic text-[16px] text-[rgba(0,0,0,0.25)] top-[7px] tracking-[-0.3125px] whitespace-nowrap">Ex: FR12345678901</p>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents left-[484px] top-[2px]">
      <Container32 />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[0] left-[491px] not-italic text-[#e3262f] text-[14px] top-[2px] tracking-[-0.1504px] w-[253px]">
        <span className="leading-[22px]">*</span>
        <span className="leading-[22px] text-[rgba(0,0,0,0.88)]">{` Email global client`}</span>
      </p>
    </div>
  );
}

function Row6() {
  return (
    <div className="absolute h-[70px] left-[356px] top-[714px] w-[998px]" data-name="Row">
      <Col6 />
      <FormItemInput5 />
      <Group3 />
    </div>
  );
}

function Container33() {
  return (
    <div className="h-px relative shrink-0 w-[54.578px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#3643ba] border-solid border-t inset-0 pointer-events-none" />
    </div>
  );
}

function Text11() {
  return (
    <div className="h-[22px] relative shrink-0 w-[194.25px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Decathlon_Text:Medium',sans-serif] leading-[22px] left-[97.5px] not-italic text-[#3643ba] text-[14px] text-center top-0 whitespace-nowrap">Adresse du siège social</p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="h-0 relative shrink-0 w-[747px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#3643ba] border-solid border-t inset-0 pointer-events-none" />
    </div>
  );
}

function Divider3() {
  return (
    <div className="absolute content-stretch flex h-[22px] items-center left-[356px] top-[809px] w-[1286px]" data-name="Divider">
      <Container33 />
      <Text11 />
      <Container34 />
    </div>
  );
}

function FormItemLabel7() {
  return (
    <div className="h-[22px] relative shrink-0 w-full" data-name="FormItemLabel">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[22px] left-0 not-italic text-[14px] text-[rgba(0,0,0,0.88)] top-0 tracking-[-0.1504px] whitespace-nowrap">Numéro</p>
    </div>
  );
}

function Col7() {
  return (
    <div className="absolute content-stretch flex flex-col h-[30px] items-start left-0 overflow-clip pr-[134.734px] top-0 w-[200px]" data-name="Col">
      <FormItemLabel7 />
    </div>
  );
}

function TextInput3() {
  return (
    <div className="absolute bg-white h-[40px] left-0 rounded-[8px] top-0 w-[200px]" data-name="Text Input">
      <div className="content-stretch flex items-center overflow-clip px-[11px] py-[7px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(0,0,0,0.25)] tracking-[-0.3125px] whitespace-nowrap">123</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function FormItemInput6() {
  return (
    <div className="absolute h-[40px] left-0 top-[30px] w-[200px]" data-name="FormItemInput">
      <TextInput3 />
    </div>
  );
}

function Row7() {
  return (
    <div className="absolute h-[70px] left-0 top-0 w-[200px]" data-name="Row">
      <Col7 />
      <FormItemInput6 />
    </div>
  );
}

function ClientForm8() {
  return (
    <div className="absolute h-[22px] left-[9.45px] top-0 w-[38.125px]" data-name="ClientForm">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[0] left-0 not-italic text-[#e3262f] text-[14px] top-0 tracking-[-0.1504px] whitespace-nowrap">
        <span className="leading-[22px]">*</span>
        <span className="leading-[22px] text-[rgba(0,0,0,0.88)]">{` Voie`}</span>
      </p>
    </div>
  );
}

function FormItemLabel8() {
  return (
    <div className="h-[22px] relative shrink-0 w-full" data-name="FormItemLabel">
      <ClientForm8 />
    </div>
  );
}

function Col8() {
  return (
    <div className="absolute content-stretch flex flex-col h-[30px] items-start left-0 overflow-clip pr-[1008.406px] top-0 w-[1070px]" data-name="Col">
      <FormItemLabel8 />
    </div>
  );
}

function TextInput4() {
  return (
    <div className="absolute bg-white h-[40px] left-0 rounded-[8px] top-0 w-[781px]" data-name="Text Input">
      <div className="content-stretch flex items-center overflow-clip px-[11px] py-[7px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(0,0,0,0.25)] tracking-[-0.3125px] whitespace-nowrap">Rue de la République</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function FormItemInput7() {
  return (
    <div className="absolute h-[40px] left-0 top-[30px] w-[1070px]" data-name="FormItemInput">
      <TextInput4 />
    </div>
  );
}

function Row8() {
  return (
    <div className="absolute h-[70px] left-[216px] top-0 w-[1070px]" data-name="Row">
      <Col8 />
      <FormItemInput7 />
    </div>
  );
}

function ClientForm7() {
  return (
    <div className="absolute h-[94px] left-[356px] top-[859px] w-[1286px]" data-name="ClientForm">
      <Row7 />
      <Row8 />
    </div>
  );
}

function ClientForm10() {
  return (
    <div className="absolute h-[22px] left-[9.45px] top-0 w-[88px]" data-name="ClientForm">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[0] left-0 not-italic text-[#e3262f] text-[14px] top-0 tracking-[-0.1504px] whitespace-nowrap">
        <span className="leading-[22px]">*</span>
        <span className="leading-[22px] text-[rgba(0,0,0,0.88)]">{` Code Postal`}</span>
      </p>
    </div>
  );
}

function FormItemLabel9() {
  return (
    <div className="h-[22px] relative shrink-0 w-full" data-name="FormItemLabel">
      <ClientForm10 />
    </div>
  );
}

function Col9() {
  return (
    <div className="absolute content-stretch flex flex-col h-[30px] items-start left-0 overflow-clip pr-[88.531px] top-0 w-[200px]" data-name="Col">
      <FormItemLabel9 />
    </div>
  );
}

function TextInput5() {
  return (
    <div className="absolute bg-white h-[40px] left-0 rounded-[8px] top-0 w-[200px]" data-name="Text Input">
      <div className="content-stretch flex items-center overflow-clip px-[11px] py-[7px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(0,0,0,0.25)] tracking-[-0.3125px] whitespace-nowrap">75001</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function FormItemInput8() {
  return (
    <div className="absolute h-[40px] left-0 top-[30px] w-[200px]" data-name="FormItemInput">
      <TextInput5 />
    </div>
  );
}

function Row9() {
  return (
    <div className="absolute h-[70px] left-0 top-0 w-[200px]" data-name="Row">
      <Col9 />
      <FormItemInput8 />
    </div>
  );
}

function ClientForm11() {
  return (
    <div className="absolute h-[22px] left-[9.45px] top-0 w-[37.469px]" data-name="ClientForm">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[0] left-0 not-italic text-[#e3262f] text-[14px] top-0 tracking-[-0.1504px] whitespace-nowrap">
        <span className="leading-[22px]">*</span>
        <span className="leading-[22px] text-[rgba(0,0,0,0.88)]">{` Ville`}</span>
      </p>
    </div>
  );
}

function FormItemLabel10() {
  return (
    <div className="h-[22px] relative shrink-0 w-full" data-name="FormItemLabel">
      <ClientForm11 />
    </div>
  );
}

function Col10() {
  return (
    <div className="absolute content-stretch flex flex-col h-[30px] items-start left-0 overflow-clip pr-[1009.063px] top-0 w-[1070px]" data-name="Col">
      <FormItemLabel10 />
    </div>
  );
}

function TextInput6() {
  return (
    <div className="absolute bg-white h-[40px] left-0 rounded-[8px] top-0 w-[781px]" data-name="Text Input">
      <div className="content-stretch flex items-center overflow-clip px-[11px] py-[7px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(0,0,0,0.25)] tracking-[-0.3125px] whitespace-nowrap">Paris</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function FormItemInput9() {
  return (
    <div className="absolute h-[40px] left-0 top-[30px] w-[1070px]" data-name="FormItemInput">
      <TextInput6 />
    </div>
  );
}

function Row10() {
  return (
    <div className="absolute h-[70px] left-[216px] top-0 w-[1070px]" data-name="Row">
      <Col10 />
      <FormItemInput9 />
    </div>
  );
}

function ClientForm9() {
  return (
    <div className="absolute h-[94px] left-[356px] top-[944px] w-[1286px]" data-name="ClientForm">
      <Row9 />
      <Row10 />
    </div>
  );
}

function Divider4() {
  return <div className="absolute border-[#3643ba] border-solid border-t h-px left-[356px] top-[1053px] w-[997px]" data-name="Divider" />;
}

function ClientForm13() {
  return (
    <div className="absolute h-[22px] left-[9.45px] top-0 w-[88px]" data-name="ClientForm">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[0] left-0 not-italic text-[#e3262f] text-[14px] top-0 tracking-[-0.1504px] whitespace-nowrap">
        <span className="leading-[22px]">*</span>
        <span className="leading-[22px] text-[rgba(0,0,0,0.88)]">{` Code Postal`}</span>
      </p>
    </div>
  );
}

function FormItemLabel11() {
  return (
    <div className="h-[22px] relative shrink-0 w-full" data-name="FormItemLabel">
      <ClientForm13 />
    </div>
  );
}

function Col11() {
  return (
    <div className="absolute content-stretch flex flex-col h-[30px] items-start left-0 overflow-clip pr-[88.531px] top-0 w-[200px]" data-name="Col">
      <FormItemLabel11 />
    </div>
  );
}

function TextInput7() {
  return (
    <div className="absolute bg-white h-[40px] left-0 rounded-[8px] top-0 w-[200px]" data-name="Text Input">
      <div className="content-stretch flex items-center overflow-clip px-[11px] py-[7px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(0,0,0,0.25)] tracking-[-0.3125px] whitespace-nowrap">75001</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function FormItemInput10() {
  return (
    <div className="absolute h-[40px] left-0 top-[30px] w-[200px]" data-name="FormItemInput">
      <TextInput7 />
    </div>
  );
}

function Row11() {
  return (
    <div className="absolute h-[70px] left-0 top-0 w-[200px]" data-name="Row">
      <Col11 />
      <FormItemInput10 />
    </div>
  );
}

function ClientForm14() {
  return (
    <div className="absolute h-[22px] left-[9.45px] top-0 w-[37.469px]" data-name="ClientForm">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[0] left-0 not-italic text-[#e3262f] text-[14px] top-0 tracking-[-0.1504px] whitespace-nowrap">
        <span className="leading-[22px]">*</span>
        <span className="leading-[22px] text-[rgba(0,0,0,0.88)]">{` Ville`}</span>
      </p>
    </div>
  );
}

function FormItemLabel12() {
  return (
    <div className="h-[22px] relative shrink-0 w-full" data-name="FormItemLabel">
      <ClientForm14 />
    </div>
  );
}

function Col12() {
  return (
    <div className="absolute content-stretch flex flex-col h-[30px] items-start left-0 overflow-clip pr-[1009.063px] top-0 w-[1070px]" data-name="Col">
      <FormItemLabel12 />
    </div>
  );
}

function TextInput8() {
  return (
    <div className="absolute bg-white h-[40px] left-0 rounded-[8px] top-[-0.14px] w-[782px]" data-name="Text Input">
      <div className="content-stretch flex items-center overflow-clip px-[11px] py-[7px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(0,0,0,0.25)] tracking-[-0.3125px] whitespace-nowrap">Paris</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function FormItemInput11() {
  return (
    <div className="absolute h-[40px] left-0 top-[30px] w-[1070px]" data-name="FormItemInput">
      <TextInput8 />
    </div>
  );
}

function Row12() {
  return (
    <div className="absolute h-[70px] left-[216px] top-0 w-[1070px]" data-name="Row">
      <Col12 />
      <FormItemInput11 />
    </div>
  );
}

function ClientForm12() {
  return (
    <div className="absolute h-[94px] left-[356px] top-[1430.14px] w-[1286px]" data-name="ClientForm">
      <Row11 />
      <Row12 />
    </div>
  );
}

function IconReact8() {
  return (
    <div className="absolute left-0 size-[24px] top-0" data-name="IconReact">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g clipPath="url(#clip0_1_4494)" id="IconReact">
          <path d={svgPaths.p287a0d80} fill="var(--fill-0, #FAAD14)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_4494">
            <rect fill="white" height="24" width="24" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function AntdIcon8() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="AntdIcon">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <IconReact8 />
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="h-[25.141px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[25.143px] left-0 not-italic text-[16px] text-[rgba(0,0,0,0.88)] top-0 tracking-[-0.3125px] whitespace-nowrap">Adresse de livraison différente</p>
    </div>
  );
}

function Container37() {
  return (
    <div className="h-[22px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[22px] left-0 not-italic text-[14px] text-[rgba(0,0,0,0.88)] top-0 tracking-[-0.1504px] whitespace-nowrap">{`Veuillez renseigner l'adresse de livraison si elle diffère du siège social`}</p>
    </div>
  );
}

function Container35() {
  return (
    <div className="flex-[1200_0_0] h-[55.141px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Container36 />
        <Container37 />
      </div>
    </div>
  );
}

function CssMotion() {
  return (
    <div className="absolute bg-[#fffbe6] content-stretch flex gap-[12px] h-[97.141px] items-start left-[356px] pb-px pt-[21px] px-[25px] rounded-[8px] top-[1130px] w-[1286px]" data-name="CSSMotion">
      <div aria-hidden="true" className="absolute border border-[#ffe58f] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <AntdIcon8 />
      <Container35 />
    </div>
  );
}

function IconReact9() {
  return (
    <div className="absolute left-0 size-[14px] top-0" data-name="IconReact">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_1_4470)" id="IconReact">
          <path d={svgPaths.p2ddbee00} fill="var(--fill-0, black)" fillOpacity="0.45" id="Vector" />
          <path d={svgPaths.p1efee500} fill="var(--fill-0, black)" fillOpacity="0.45" id="Vector_2" />
        </g>
        <defs>
          <clipPath id="clip0_1_4470">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function AntdIcon9() {
  return (
    <div className="absolute left-[186.88px] size-[14px] top-[3.75px]" data-name="AntdIcon">
      <IconReact9 />
    </div>
  );
}

function FormItemLabel13() {
  return (
    <div className="h-[22px] relative shrink-0 w-full" data-name="FormItemLabel">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[22px] left-0 not-italic text-[14px] text-[rgba(0,0,0,0.88)] top-0 tracking-[-0.1504px] whitespace-nowrap">Identifiant de livraison (TVA)</p>
      <AntdIcon9 />
    </div>
  );
}

function Col13() {
  return (
    <div className="absolute content-stretch flex flex-col h-[30px] items-start left-0 overflow-clip pr-[1071.109px] top-0 w-[1286px]" data-name="Col">
      <FormItemLabel13 />
    </div>
  );
}

function TextInput9() {
  return (
    <div className="absolute bg-white h-[40px] left-0 rounded-[8px] top-[-0.14px] w-[1003px]" data-name="Text Input">
      <div className="content-stretch flex items-center overflow-clip px-[11px] py-[7px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(0,0,0,0.25)] tracking-[-0.3125px] whitespace-nowrap">FR12345678901</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function FormItemInput12() {
  return (
    <div className="absolute h-[40px] left-0 top-[30px] w-[1286px]" data-name="FormItemInput">
      <TextInput9 />
    </div>
  );
}

function Row13() {
  return (
    <div className="absolute h-[70px] left-[356px] top-[1242.14px] w-[1286px]" data-name="Row">
      <Col13 />
      <FormItemInput12 />
    </div>
  );
}

function FormItemLabel14() {
  return (
    <div className="h-[22px] relative shrink-0 w-full" data-name="FormItemLabel">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[22px] left-0 not-italic text-[14px] text-[rgba(0,0,0,0.88)] top-0 tracking-[-0.1504px] whitespace-nowrap">Numéro</p>
    </div>
  );
}

function Col14() {
  return (
    <div className="absolute content-stretch flex flex-col h-[30px] items-start left-0 overflow-clip pr-[134.734px] top-0 w-[200px]" data-name="Col">
      <FormItemLabel14 />
    </div>
  );
}

function TextInput10() {
  return (
    <div className="absolute bg-white h-[40px] left-0 rounded-[8px] top-0 w-[200px]" data-name="Text Input">
      <div className="content-stretch flex items-center overflow-clip px-[11px] py-[7px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(0,0,0,0.25)] tracking-[-0.3125px] whitespace-nowrap">123</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function FormItemInput13() {
  return (
    <div className="absolute h-[40px] left-0 top-[30px] w-[200px]" data-name="FormItemInput">
      <TextInput10 />
    </div>
  );
}

function Row14() {
  return (
    <div className="absolute h-[70px] left-0 top-0 w-[200px]" data-name="Row">
      <Col14 />
      <FormItemInput13 />
    </div>
  );
}

function ClientForm16() {
  return (
    <div className="absolute h-[22px] left-[9.45px] top-0 w-[38.125px]" data-name="ClientForm">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[0] left-0 not-italic text-[#e3262f] text-[14px] top-0 tracking-[-0.1504px] whitespace-nowrap">
        <span className="leading-[22px]">*</span>
        <span className="leading-[22px] text-[rgba(0,0,0,0.88)]">{` Voie`}</span>
      </p>
    </div>
  );
}

function FormItemLabel15() {
  return (
    <div className="h-[22px] relative shrink-0 w-full" data-name="FormItemLabel">
      <ClientForm16 />
    </div>
  );
}

function Col15() {
  return (
    <div className="absolute content-stretch flex flex-col h-[30px] items-start left-0 overflow-clip pr-[1008.406px] top-0 w-[1070px]" data-name="Col">
      <FormItemLabel15 />
    </div>
  );
}

function TextInput11() {
  return (
    <div className="absolute bg-white h-[40px] left-0 rounded-[8px] top-[-0.14px] w-[786px]" data-name="Text Input">
      <div className="content-stretch flex items-center overflow-clip px-[11px] py-[7px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(0,0,0,0.25)] tracking-[-0.3125px] whitespace-nowrap">Rue de la Livraison</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function FormItemInput14() {
  return (
    <div className="absolute h-[40px] left-0 top-[30px] w-[1070px]" data-name="FormItemInput">
      <TextInput11 />
    </div>
  );
}

function Row15() {
  return (
    <div className="absolute h-[70px] left-[216px] top-0 w-[1070px]" data-name="Row">
      <Col15 />
      <FormItemInput14 />
    </div>
  );
}

function ClientForm15() {
  return (
    <div className="absolute h-[94px] left-[356px] top-[1336.14px] w-[1286px]" data-name="ClientForm">
      <Row14 />
      <Row15 />
    </div>
  );
}

function Checkbox() {
  return (
    <div className="absolute h-[22px] left-[16px] top-0 w-[344.656px]" data-name="Checkbox">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[22px] left-[8px] not-italic text-[14px] text-[rgba(0,0,0,0.88)] top-0 tracking-[-0.1504px] whitespace-nowrap">{`L'adresse de livraison est différente du siège social`}</p>
    </div>
  );
}

function Text12() {
  return <div className="absolute bg-[#1677ff] border border-[#1677ff] border-solid left-0 rounded-[4px] size-[16px] top-[3px]" data-name="Text" />;
}

function Wave() {
  return (
    <div className="h-[22px] relative shrink-0 w-[360.656px]" data-name="Wave">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Checkbox />
        <Text12 />
      </div>
    </div>
  );
}

function FormItemInput15() {
  return (
    <div className="absolute content-stretch flex h-[32px] items-center left-0 top-0 w-[1286px]" data-name="FormItemInput">
      <Wave />
    </div>
  );
}

function Row16() {
  return (
    <div className="absolute h-[32px] left-[356px] top-[1086px] w-[1286px]" data-name="Row">
      <FormItemInput15 />
    </div>
  );
}

export default function GestionDesClientsIdentiteLegaleCommerciale() {
  return (
    <div className="bg-white relative size-full" data-name="Gestion des clients - Identité Légale & Commerciale">
      <Group1 />
      <Row />
      <Container1 />
      <P />
      <div className="absolute content-stretch flex flex-col items-center justify-center left-0 top-[139px] w-[1440px]" data-name="Divider">
        <div className="bg-[#e1e0df] h-px shrink-0 w-full" data-name="separator" />
      </div>
      <div className="absolute h-[85px] left-0 top-0 w-[1440px]" data-name="Component 1">
        <div className="absolute content-stretch flex flex-col inset-[0_0_1.18%_0] items-start" data-name="Internal application --Navigation header" />
        <div className="absolute flex inset-[41.18%_77.99%_31.76%_20.97%] items-center justify-center">
          <div className="flex-none h-[23px] rotate-180 w-[15px]">
            <div className="relative size-full">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 23">
                <g id="Vector 1">
                  <path d={svgPaths.p19b1d100} fill="var(--fill-0, #3643BA)" />
                  <path d={svgPaths.p1ea77170} fill="var(--fill-0, #3643BA)" />
                </g>
              </svg>
            </div>
          </div>
        </div>
        <Calque />
        <div className="absolute flex inset-[43.53%_81.11%_31.76%_18.82%] items-center justify-center">
          <div className="flex-none h-px rotate-90 w-[21px]">
            <div className="content-stretch flex flex-col items-center justify-center relative size-full" data-name="Divider">
              <div className="bg-[#3643ba] h-px shrink-0 w-full" data-name="separator" />
            </div>
          </div>
        </div>
        <div className="absolute aspect-[150/48] left-[79.17%] right-[16.11%] top-[37px]" data-name="image 1">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage1} />
        </div>
        <div className="absolute flex inset-[58.82%_78.89%_27.06%_20.28%] items-center justify-center">
          <div className="flex-none rotate-180 size-[12px]">
            <div className="relative size-full">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
                <path d={svgPaths.p3b347c00} fill="var(--fill-0, #7AFFA6)" id="Vector 2" />
              </svg>
            </div>
          </div>
        </div>
        <Top />
        <div className="absolute content-stretch flex flex-col inset-[98.82%_0_0_0] items-center justify-center" data-name="Divider">
          <div className="bg-[#e1e0df] h-px shrink-0 w-full" data-name="separator" />
        </div>
      </div>
      <Link />
      <Link1 />
      <Link2 />
      <Link3 />
      <Div />
      <Row1 />
      <Divider />
      <Divider1 />
      <Divider2 />
      <Row2 />
      <Group2 />
      <ClientForm3 />
      <Row6 />
      <Divider3 />
      <ClientForm7 />
      <ClientForm9 />
      <Divider4 />
      <ClientForm12 />
      <CssMotion />
      <Row13 />
      <ClientForm15 />
      <Row16 />
    </div>
  );
}