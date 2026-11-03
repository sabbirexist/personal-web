import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The mark: a bold signature "S" — the Instrument Serif italic capital,
 * outlined to a single filled path so it needs no font at runtime.
 * Pure SVG, inherits currentColor, scales from 16px favicon to billboard.
 */
export function LogoMark({
  size = 30,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M10.70843911764074 21.199999999999996Q10.011280795583907 21.199999999999996 9.22697768326997
          21.05060893098782Q8.442674570956033 20.901217861975642 7.757965504650214 20.639783491204327Q7.073256438344394
          20.378349120433015 6.674880254311919 20.029769959404597Q6.55038769680177 19.90527740189445 6.513039929548725
          19.7807848443843Q6.4756921622956805 19.65629228687415 6.52548918529974 19.407307171853855L7.222647507356573
          15.49824086603518Q7.297343041862662 15.050067658998646 7.62102369138905 15.050067658998646Q7.919805829413407
          15.050067658998646 7.919805829413407 15.54803788903924L7.944704340915436 16.5190798376184Q7.994501363919496
          18.6105548037889 8.6667611744743 19.531799729364003Q9.339020985029103 20.453044654939106 10.857830186652919
          20.453044654939106Q12.252146830766586 20.453044654939106 13.173391756341687
          19.444654939106897Q14.09463668191679 18.43626522327469 14.09463668191679 16.74316644113667Q14.09463668191679
          15.64763193504736 13.497072405868074 14.452503382949931Q12.89950812981936 13.257374830852502 11.82887213523208
          12.062246278755072Q10.559048048628561 10.643031123139377 9.949034516828831 9.472801082543977Q9.339020985029103
          8.302571041948578 9.339020985029103 7.007848443843031Q9.339020985029103 5.98700947225981 9.836991215069698
          5.028416779431664Q10.334961445110295 4.069824086603518 11.3433511609425 3.4349120433017593Q12.351740876774706
          2.8000000000000007 13.92034710140258 2.8000000000000007Q16.08651760207917 2.8000000000000007
          17.231849131172538 3.7710419485791604Q17.580428292200956 4.044925575101487 17.48083424619284
          4.592692828146141L16.783675924136002 8.227875507442489Q16.708980389629914 8.601353179972936 16.435096763107587
          8.601353179972936Q16.16121313658526 8.601353179972936 16.1114161135812 8.17807848443843L16.08651760207917
          7.655209742895805Q15.986923556071051 5.638430311231394 15.5263010932835 4.580243572395129Q15.065678630495949
          3.522056833558864 13.696260497884314 3.522056833558864Q12.700320037803122 3.522056833558864 12.102755761754409
          3.9702300405954Q11.505191485705694 4.418403247631936 11.231307859183367 5.078213802435724Q10.957424232661038
          5.738024357239512 10.957424232661038 6.385385656292286Q10.957424232661038 7.107442489851149 11.156612324677276
          7.767253044654938Q11.355800416693516 8.427063599458727 11.841321390983095 9.161569688768605Q12.326842365272675
          9.896075778078483 13.173391756341687 10.941813261163734Q14.368520308439116 12.36102841677943 15.04078011899392
          13.655751014884977Q15.713039929548724 14.950473612990525 15.713039929548724
          16.170500676589985Q15.713039929548724 17.63951285520974 15.053229374744935
          18.772395128552095Q14.393418819941147 19.90527740189445 13.272985802349806
          20.55263870094722Q12.152552784758466 21.199999999999996 10.70843911764074 21.199999999999996Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.55"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({
  wordmark = "SABBIR",
  href = "/",
  size = 28,
  sub = "Edit / Motion",
  className,
  invert = false,
}: {
  wordmark?: string;
  href?: string;
  size?: number;
  sub?: string;
  className?: string;
  invert?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label={`${wordmark} — home`}
      className={cn(
        "group inline-flex items-center gap-1.5 select-none",
        className
      )}
    >
      <span className="relative text-accent transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-rotate-[18deg]">
        <LogoMark size={size} />
      </span>
      <span
        className={cn(
          "flex flex-col leading-none",
          invert ? "text-accent-ink" : "text-ink"
        )}
      >
        <span className="flex items-center gap-1.5">
          <span className="font-semibold tracking-[-0.05em]" style={{ fontSize: size * 0.62 }}>
            {wordmark}
          </span>
          <span
            className="mono whitespace-nowrap opacity-40"
            style={{ fontSize: Math.max(6.5, size * 0.28), letterSpacing: "0.16em" }}
          >
            — PORTFOLIO
          </span>
        </span>
        <span
          className={cn(
            "mono mt-1 hidden whitespace-nowrap opacity-55 sm:block",
            invert ? "text-accent-ink" : "text-muted"
          )}
          style={{ fontSize: Math.max(7, size * 0.24), letterSpacing: "0.18em" }}
        >
          {sub}
        </span>
      </span>
    </Link>
  );
}

/** Big footer wordmark with the accent full-stop. */
export function Wordmark({ text = "SABBIR", className }: { text?: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-baseline", className)}>
      {text}
      <span className="text-accent">.</span>
    </span>
  );
}
