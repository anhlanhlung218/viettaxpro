
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calculator, 
  Info, 
  ArrowRightLeft, 
  Users, 
  ShieldCheck, 
  TrendingUp,
  CreditCard,
  Building2,
  Wallet,
  Briefcase,
  FileText,
  HelpCircle,
  ArrowUpRight,
  ChevronRight,
  Calendar,
  Zap,
  Download,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  ArrowDown,
  ExternalLink,
  Shield
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { jsPDF } from 'jspdf';
import { Region, CalculationInputs, TaxResult } from './types';
import { calculateGrossToNet, calculateNetToGross } from './utils/taxCalculator';

const COLORS = ['#10b981', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6'];

const App: React.FC = () => {
  const [inputs, setInputs] = useState<CalculationInputs>({
    salary: 25000000,
    dependents: 0,
    region: Region.REGION_1,
    isGrossToNet: true,
    insuranceSalary: 'full'
  });

  const result = useMemo(() => {
    return inputs.isGrossToNet ? calculateGrossToNet(inputs) : calculateNetToGross(inputs);
  }, [inputs]);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("VIETTAX PRO - BAO CAO THUE", 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text("Website: viettaxpro.vn", 105, 27, { align: 'center' });
    doc.line(20, 35, 190, 35);
    
    let y = 50;
    const addLine = (label: string, value: string, isBold = false) => {
      if (isBold) doc.setFont("helvetica", "bold");
      else doc.setFont("helvetica", "normal");
      doc.text(label, 20, y);
      doc.text(value, 190, y, { align: 'right' });
      y += 10;
    };

    addLine("Luong Gross:", `${result.grossSalary.toLocaleString()} VND`, true);
    addLine("BHXH (8%):", `-${result.socialInsurance.toLocaleString()} VND`);
    addLine("BHYT (1.5%):", `-${result.healthInsurance.toLocaleString()} VND`);
    addLine("BHTN (1%):", `-${result.unemploymentInsurance.toLocaleString()} VND`);
    y += 5;
    addLine("Thu nhap truoc thue:", `${result.incomeBeforeTax.toLocaleString()} VND`, true);
    addLine("Giam tru gia canh:", `-${(result.selfDeduction + result.dependentDeduction).toLocaleString()} VND`);
    y += 5;
    addLine("Thu nhap tinh thue:", `${result.taxableIncome.toLocaleString()} VND`, true);
    addLine("Thue TNCN phai nop:", `-${result.personalIncomeTax.toLocaleString()} VND`);
    y += 10;
    doc.setFontSize(16);
    addLine("LUONG THUC NHAN (NET):", `${result.netSalary.toLocaleString()} VND`, true);
    
    doc.save(`VietTaxPro_Bao_Cao.pdf`);
  };

  const chartData = [
    { name: 'Lương Net', value: result.netSalary },
    { name: 'Bảo hiểm', value: result.socialInsurance + result.healthInsurance + result.unemploymentInsurance },
    { name: 'Thuế TNCN', value: result.personalIncomeTax },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 scroll-smooth">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-[100]">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <div className="bg-indigo-600 p-2 rounded-xl text-white">
              <Calculator className="w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-800">VietTax Pro</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            <a href="#hero" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Trang chủ</a>
            <a href="#tool" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Máy tính Thuế</a>
            <a href="#knowledge" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Kiến thức</a>
            <a href="#about" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Về chúng tôi</a>
          </div>

          <a href="#tool" className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200">
            Tính ngay
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-40 pb-20 bg-gradient-to-b from-indigo-50/50 to-white">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-indigo-100/50 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-top-4">
            <Zap className="w-3.5 h-3.5" />
            Cập nhật quy định 2024 mới nhất
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8 animate-in fade-in slide-in-from-top-6 duration-700">
            Tính toán thuế TNCN <br />
            <span className="text-indigo-600">Nhanh chóng & Chính xác.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 font-medium mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-top-8 duration-1000">
            VietTax Pro giúp bạn tối ưu hóa thu nhập, hiểu rõ các khoản khấu trừ và lập kế hoạch tài chính cá nhân bền vững với công cụ tính toán chuyên nghiệp.
          </p>
          <div className="flex flex-col sm:row items-center justify-center gap-4 animate-in fade-in slide-in-from-top-10 duration-1000">
            <a href="#tool" className="w-full sm:w-auto bg-indigo-600 text-white px-10 py-5 rounded-2xl text-lg font-bold hover:bg-indigo-700 hover:-translate-y-1 transition-all shadow-2xl shadow-indigo-100 flex items-center justify-center gap-2">
              Khám phá công cụ <ArrowDown className="w-5 h-5" />
            </a>
            <a href="#knowledge" className="w-full sm:w-auto bg-white text-slate-600 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-slate-50 border border-slate-200 transition-all flex items-center justify-center gap-2">
              Tìm hiểu luật thuế <BookOpen className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Tool Section */}
      <section id="tool" className="py-24 bg-white relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:row items-center justify-between gap-12 mb-20">
            <div className="max-w-xl">
              <h2 className="text-4xl font-black text-slate-900 mb-6">Máy tính Thuế TNCN <br /> Thông minh</h2>
              <p className="text-slate-500 font-medium leading-relaxed">
                Tự động hóa mọi bước tính toán: từ BHXH, BHYT đến biểu thuế lũy tiến từng phần. Chúng tôi đảm bảo mọi con số đều tuân thủ các nghị định thuế mới nhất của Chính phủ Việt Nam.
              </p>
            </div>
            <div className="flex gap-4">
               <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center gap-2">
                  <span className="text-2xl font-black text-indigo-600">100%</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Chính xác</span>
               </div>
               <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center gap-2">
                  <span className="text-2xl font-black text-emerald-600">v2.5</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phiên bản</span>
               </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 bg-slate-50/50 p-8 md:p-12 rounded-[3rem] border border-slate-100">
            {/* Form Column */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Cài đặt lương</h3>
                  <button 
                    onClick={() => setInputs(p => ({ ...p, isGrossToNet: !p.isGrossToNet }))}
                    className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-100 transition-all"
                  >
                    <ArrowRightLeft className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      Lương {inputs.isGrossToNet ? 'Gross' : 'Net'} hàng tháng (VND)
                    </label>
                    <input 
                      type="number" 
                      value={inputs.salary}
                      onChange={(e) => setInputs(p => ({ ...p, salary: Number(e.target.value) }))}
                      className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all text-2xl font-black"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Người phụ thuộc</label>
                      <select 
                        value={inputs.dependents}
                        onChange={(e) => setInputs(p => ({ ...p, dependents: Number(e.target.value) }))}
                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none font-bold"
                      >
                        {[0,1,2,3,4,5].map(v => <option key={v} value={v}>{v} người</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Vùng làm việc</label>
                      <select 
                        value={inputs.region}
                        onChange={(e) => setInputs(p => ({ ...p, region: e.target.value as Region }))}
                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none font-bold"
                      >
                        {Object.values(Region).map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Mức đóng Bảo hiểm</label>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setInputs(p => ({ ...p, insuranceSalary: 'full' }))}
                        className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${inputs.insuranceSalary === 'full' ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                      >
                        Full lương
                      </button>
                      <button 
                        onClick={() => setInputs(p => ({ ...p, insuranceSalary: inputs.salary }))}
                        className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${inputs.insuranceSalary !== 'full' ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                      >
                        Tùy chỉnh
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-900 rounded-[2rem] text-white">
                <h4 className="font-black mb-6 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  Ghi chú Pháp lý 2024
                </h4>
                <div className="space-y-4 text-sm font-medium text-slate-400">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <span>Lương cơ sở:</span>
                    <span className="text-white font-black">2.340.000₫</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <span>Giảm trừ cá nhân:</span>
                    <span className="text-white font-black">11.000.000₫</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Mỗi người phụ thuộc:</span>
                    <span className="text-white font-black">4.400.000₫</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Column */}
            <div className="lg:col-span-7 space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                  <div className="bg-emerald-100 text-emerald-700 w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase mb-4 tracking-widest">Lương Net Nhận được</div>
                  <p className="text-5xl font-black text-slate-900">{result.netSalary.toLocaleString()}₫</p>
                  <div className="mt-6 flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase">
                    <TrendingUp className="w-4 h-4" />
                    + {((result.netSalary / result.grossSalary) * 100).toFixed(1)}% Lương Gross
                  </div>
                </div>
                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                  <div className="bg-rose-100 text-rose-700 w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase mb-4 tracking-widest">Thuế TNCN phải nộp</div>
                  <p className="text-5xl font-black text-rose-600">{result.personalIncomeTax.toLocaleString()}₫</p>
                  <p className="mt-6 text-slate-400 font-bold text-[10px] uppercase">Dựa trên biểu thuế lũy tiến</p>
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                    <FileText className="w-6 h-6 text-indigo-600" />
                    Báo cáo Phân tích Chi tiết
                  </h3>
                  <button 
                    onClick={handleExportPDF}
                    className="text-xs font-black text-indigo-600 flex items-center gap-2 hover:bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 transition-all"
                  >
                    Tải báo cáo PDF <Download className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "Lương Gross", val: result.grossSalary, sub: "Tổng thu nhập niêm yết", color: "text-slate-900" },
                    { label: "Tổng Bảo hiểm (10.5%)", val: -(result.socialInsurance + result.healthInsurance + result.unemploymentInsurance), sub: "BHXH, BHYT, BHTN", color: "text-rose-500" },
                    { label: "Thu nhập trước thuế", val: result.incomeBeforeTax, sub: "Gross - Bảo hiểm", color: "text-slate-900", isBold: true },
                    { label: "Giảm trừ gia cảnh", val: -(result.selfDeduction + result.dependentDeduction), sub: "Bản thân & Người phụ thuộc", color: "text-emerald-600" },
                    { label: "Thu nhập tính thuế", val: result.taxableIncome, sub: "Cơ sở để áp biểu thuế", color: "text-indigo-600", isBold: true },
                  ].map((item, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-5 rounded-2xl ${item.isBold ? 'bg-slate-50 border border-slate-100' : ''}`}>
                      <div>
                        <p className={`text-sm font-black ${item.color}`}>{item.label}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.sub}</p>
                      </div>
                      <p className={`text-lg font-black ${item.color}`}>{item.val.toLocaleString()}₫</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progressive Tax Explanation Section */}
      <section id="knowledge" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-4xl font-black text-slate-900 mb-6">Kiến thức về Thuế Lũy tiến</h2>
            <p className="text-slate-500 font-medium">
              Tại Việt Nam, thuế TNCN được áp dụng theo phương pháp lũy tiến từng phần. Hãy cùng tìm hiểu cơ chế hoạt động đằng sau các con số.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-12">
              <div className="relative p-10 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50">
                <div className="absolute -top-6 -left-6 bg-indigo-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-lg">1</div>
                <h3 className="text-xl font-black mb-6">Cơ chế Lũy tiến là gì?</h3>
                <p className="text-slate-500 leading-relaxed font-medium mb-6">
                  Nghĩa là thu nhập của bạn không bị đánh thuế một mức duy nhất. Thay vào đó, nó được chia thành từng bậc. Thu nhập ở bậc thấp sẽ chịu thuế thấp (5%), và chỉ phần vượt ngưỡng mới chịu mức thuế cao hơn.
                </p>
                <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                  <p className="text-sm font-bold text-indigo-700">Ví dụ minh họa:</p>
                  <p className="text-xs text-indigo-600 mt-2 leading-relaxed">
                    Nếu thu nhập tính thuế của bạn là 15 triệu đồng: <br />
                    • 5 triệu đầu tính thuế 5% <br />
                    • 5 triệu tiếp theo tính thuế 10% <br />
                    • 5 triệu còn lại tính thuế 15%
                  </p>
                </div>
              </div>

              <div className="relative p-10 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50">
                <div className="absolute -top-6 -left-6 bg-emerald-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-lg">2</div>
                <h3 className="text-xl font-black mb-6">Giảm trừ Gia cảnh</h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  Đây là số tiền được trừ vào thu nhập trước khi tính thuế để đảm bảo đời sống cơ bản. Từ 2024, mức giảm trừ cho bản thân là 11 triệu đồng/tháng. Nếu bạn nuôi con nhỏ hoặc bố mẹ già, bạn được cộng thêm 4,4 triệu đồng cho mỗi người.
                </p>
              </div>
            </div>

            <div className="bg-slate-900 rounded-[3rem] p-10 text-white sticky top-32 shadow-2xl">
               <h3 className="text-xl font-black mb-10 flex items-center gap-3">
                 <CreditCard className="w-6 h-6 text-indigo-400" />
                 Biểu thuế Lũy tiến 7 Bậc
               </h3>
               <div className="space-y-4">
                  {[
                    { b: "Bậc 1", r: "0 - 5tr", t: "5%" },
                    { b: "Bậc 2", r: "5 - 10tr", t: "10%" },
                    { b: "Bậc 3", r: "10 - 18tr", t: "15%" },
                    { b: "Bậc 4", r: "18 - 32tr", t: "20%" },
                    { b: "Bậc 5", r: "32 - 52tr", t: "25%" },
                    { b: "Bậc 6", r: "52 - 80tr", t: "30%" },
                    { b: "Bậc 7", r: "Trên 80tr", t: "35%" },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between py-4 border-b border-white/10 hover:bg-white/5 px-4 rounded-xl transition-all">
                      <div>
                        <p className="text-sm font-black">{row.b}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">{row.r} (VNĐ)</p>
                      </div>
                      <span className="text-lg font-black text-indigo-400">{row.t}</span>
                    </div>
                  ))}
               </div>
               <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0" />
                  <p className="text-[10px] text-slate-400 font-medium">Dựa trên Luật thuế TNCN hiện hành tại Việt Nam.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase Section */}
      <section id="about" className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-20">
             <h2 className="text-4xl font-black text-slate-900">Tại sao chọn VietTax Pro?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
             <div className="p-10 rounded-[2.5rem] bg-indigo-50 border border-indigo-100 space-y-6">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                  <Shield className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-black text-slate-900">Bảo mật Tuyệt đối</h4>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">
                  Chúng tôi không lưu trữ bất kỳ thông tin thu nhập nào của bạn trên máy chủ. Mọi tính toán diễn ra ngay trên trình duyệt của bạn.
                </p>
             </div>
             <div className="p-10 rounded-[2.5rem] bg-emerald-50 border border-emerald-100 space-y-6">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-black text-slate-900">Cập nhật Liên tục</h4>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">
                  Hệ thống tự động cập nhật mức lương cơ sở và các nghị định mới nhất của Chính phủ Việt Nam ngay khi có hiệu lực.
                </p>
             </div>
             <div className="p-10 rounded-[2.5rem] bg-slate-900 text-white space-y-6">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400 shadow-sm">
                  <ExternalLink className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-black">Xuất báo cáo Nhanh</h4>
                <p className="text-slate-400 font-medium text-sm leading-relaxed">
                  Dễ dàng xuất bảng lương chi tiết ra định dạng PDF chuyên nghiệp để đính kèm hồ sơ hoặc theo dõi chi tiêu cá nhân.
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-8">
                <div className="bg-slate-800 p-2 rounded-xl text-white">
                  <Calculator className="w-5 h-5" />
                </div>
                <span className="text-xl font-black tracking-tighter text-slate-800">VietTax Pro</span>
              </div>
              <p className="text-slate-500 font-medium leading-relaxed max-w-sm">
                Nền tảng kiến thức và công cụ tài chính cá nhân hàng đầu Việt Nam. Tận tâm giúp người lao động hiểu rõ quyền lợi và nghĩa vụ của mình.
              </p>
            </div>
            <div>
              <h5 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400 mb-8">Điều hướng</h5>
              <ul className="space-y-4 text-sm font-bold text-slate-600">
                <li className="hover:text-indigo-600 cursor-pointer transition-colors">Máy tính Thuế</li>
                <li className="hover:text-indigo-600 cursor-pointer transition-colors">Luật thuế TNCN</li>
                <li className="hover:text-indigo-600 cursor-pointer transition-colors">Tra cứu MST</li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400 mb-8">Hỗ trợ</h5>
              <ul className="space-y-4 text-sm font-bold text-slate-600">
                <li className="hover:text-indigo-600 cursor-pointer transition-colors">Liên hệ</li>
                <li className="hover:text-indigo-600 cursor-pointer transition-colors">Văn bản Pháp lý</li>
                <li className="hover:text-indigo-600 cursor-pointer transition-colors">Chính sách bảo mật</li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-8">
            <p className="text-slate-400 text-[10px] font-black tracking-widest uppercase">© 2024 VIETTAX PRO. THIẾT KẾ BỞI AI STUDIO.</p>
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4" />
                  Secured by SSL
               </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
