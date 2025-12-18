
import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  ArrowRightLeft, 
  ShieldCheck, 
  TrendingUp,
  CreditCard,
  Download,
  BookOpen,
  Zap,
  ChevronRight,
  Info,
  CalendarDays,
  ArrowRight,
  Sparkles,
  Loader2,
  RefreshCcw
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Region, CalculationInputs, PolicyYear } from './types';
import { calculateGrossToNet, calculateNetToGross } from './utils/taxCalculator';
import { getTaxAdvice } from './services/geminiService';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<CalculationInputs>({
    salary: 25000000,
    dependents: 0,
    region: Region.REGION_1,
    isGrossToNet: true,
    insuranceSalary: 'full',
    policyYear: PolicyYear.YEAR_2024
  });

  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Tính toán kết quả cho cả 2 năm để so sánh
  const result2024 = useMemo(() => {
    return inputs.isGrossToNet 
      ? calculateGrossToNet({ ...inputs, policyYear: PolicyYear.YEAR_2024 }) 
      : calculateNetToGross({ ...inputs, policyYear: PolicyYear.YEAR_2024 });
  }, [inputs]);

  const result2026 = useMemo(() => {
    return inputs.isGrossToNet 
      ? calculateGrossToNet({ ...inputs, policyYear: PolicyYear.YEAR_2026 }) 
      : calculateNetToGross({ ...inputs, policyYear: PolicyYear.YEAR_2026 });
  }, [inputs]);

  const currentResult = inputs.policyYear === PolicyYear.YEAR_2024 ? result2024 : result2026;

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(Math.round(amount));
  };

  const handleSalaryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\./g, '').replace(/[^0-9]/g, '');
    const numericValue = parseInt(rawValue, 10);
    setInputs(p => ({ 
      ...p, 
      salary: isNaN(numericValue) ? 0 : numericValue 
    }));
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const fetchAiAdvice = async () => {
    setLoadingAi(true);
    try {
      const advice = await getTaxAdvice(currentResult);
      setAiAdvice(advice || "Không có lời khuyên nào.");
    } catch (err) {
      setAiAdvice("Có lỗi khi kết nối AI. Vui lòng kiểm tra lại kết nối mạng.");
    } finally {
      setLoadingAi(false);
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("VIETTAX PRO - BAO CAO THUE", 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text("Du lieu so sanh chinh sach 2024 & 2026", 105, 27, { align: 'center' });
    doc.line(20, 35, 190, 35);
    
    let y = 50;
    doc.text("Hang muc", 20, y);
    doc.text("Quy dinh 2024", 130, y, { align: 'right' });
    doc.text("Du kien 2026", 180, y, { align: 'right' });
    y += 10;
    doc.line(20, y-5, 190, y-5);

    const addCompareLine = (label: string, val1: number, val2: number) => {
      doc.text(label, 20, y);
      doc.text(formatVND(val1), 130, y, { align: 'right' });
      doc.text(formatVND(val2), 180, y, { align: 'right' });
      y += 10;
    };

    addCompareLine("Luong Gross:", result2024.grossSalary, result2026.grossSalary);
    addCompareLine("Giam tru gia canh:", result2024.selfDeduction + result2024.dependentDeduction, result2026.selfDeduction + result2026.dependentDeduction);
    addCompareLine("Thue TNCN:", result2024.personalIncomeTax, result2026.personalIncomeTax);
    y += 10;
    doc.setFontSize(14);
    addCompareLine("LUONG NET THUC NHAN:", result2024.netSalary, result2026.netSalary);
    
    doc.save(`VietTaxPro_Report.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-lg border-b border-slate-200/60 z-[100]">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-200">
              <Calculator className="w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tight">VietTax Pro</span>
          </button>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('tool')} className="text-xs font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest">Máy tính</button>
            <button onClick={() => scrollToSection('compare')} className="text-xs font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest">So sánh 2026</button>
            <button onClick={() => scrollToSection('knowledge')} className="text-xs font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest">Kiến thức</button>
          </div>

          <button 
            onClick={() => scrollToSection('tool')}
            className="bg-slate-900 text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
          >
            Tính thuế ngay
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-48 pb-20 container mx-auto px-6 max-w-5xl text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-10 border border-emerald-100">
          <CalendarDays className="w-3.5 h-3.5" /> Dự thảo cải cách thuế TNCN 2026
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.95] mb-10 tracking-tighter">
          Minh bạch thu nhập.<br />
          <span className="text-indigo-600">Tối ưu tương lai.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
          Công cụ tính toán và so sánh thuế TNCN hiện hành (2024) với lộ trình cải cách mới nhất năm 2026.
        </p>
      </section>

      {/* Tool Section */}
      <section id="tool" className="py-20 container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Inputs */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] border border-slate-100 p-10 sticky top-32">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Cấu hình lương</h3>
                <button 
                  onClick={() => setInputs(p => ({ ...p, isGrossToNet: !p.isGrossToNet }))}
                  className="flex items-center gap-2 bg-slate-50 text-slate-900 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" /> {inputs.isGrossToNet ? 'Gross → Net' : 'Net → Gross'}
                </button>
              </div>

              <div className="space-y-10">
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-900 uppercase tracking-widest flex justify-between">
                    Lương tháng ({inputs.isGrossToNet ? 'Gross' : 'Net'})
                    <span className="text-indigo-600">VND</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      inputMode="numeric"
                      value={inputs.salary === 0 ? '' : formatVND(inputs.salary)}
                      onChange={handleSalaryInputChange}
                      placeholder="Nhập số tiền..."
                      className="w-full px-10 py-8 bg-slate-50 border-2 border-slate-100 rounded-[2rem] focus:border-indigo-500 focus:bg-white outline-none transition-all text-4xl font-black text-slate-900 placeholder:text-slate-200"
                    />
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 font-black text-2xl">₫</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Người phụ thuộc</label>
                    <select 
                      value={inputs.dependents}
                      onChange={(e) => setInputs(p => ({ ...p, dependents: Number(e.target.value) }))}
                      className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none font-black text-slate-700 cursor-pointer"
                    >
                      {[0,1,2,3,4,5].map(v => <option key={v} value={v}>{v} người</option>)}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vùng tối thiểu</label>
                    <select 
                      value={inputs.region}
                      onChange={(e) => setInputs(p => ({ ...p, region: e.target.value as Region }))}
                      className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none font-black text-slate-700 cursor-pointer"
                    >
                      {Object.values(Region).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>

                <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200/50">
                  <div className="flex items-center justify-between mb-4">
                     <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Áp dụng chính sách</span>
                     <Zap className="w-4 h-4 fill-white" />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setInputs(p => ({ ...p, policyYear: PolicyYear.YEAR_2024 }))}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${inputs.policyYear === PolicyYear.YEAR_2024 ? 'bg-white text-indigo-600 shadow-lg' : 'bg-indigo-500 text-white hover:bg-indigo-400'}`}
                    >
                      2024-2025
                    </button>
                    <button 
                      onClick={() => setInputs(p => ({ ...p, policyYear: PolicyYear.YEAR_2026 }))}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${inputs.policyYear === PolicyYear.YEAR_2026 ? 'bg-white text-indigo-600 shadow-lg' : 'bg-indigo-500 text-white hover:bg-indigo-400'}`}
                    >
                      Mới 2026
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-7 space-y-8 animate-fade-in">
            {/* AI Advisor */}
            <div className="bg-indigo-950 p-10 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="relative flex flex-col md:flex-row gap-8 items-start">
                <div className="bg-indigo-600 p-4 rounded-2xl">
                  <Sparkles className="w-8 h-8 text-indigo-200" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-black mb-4 flex items-center gap-2">Tư vấn từ VietTax AI</h4>
                  {aiAdvice ? (
                    <div className="prose prose-invert prose-sm max-w-none opacity-90 leading-relaxed">
                      {aiAdvice.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                      <button onClick={() => setAiAdvice(null)} className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase text-indigo-400 hover:text-white transition-colors">
                        <RefreshCcw className="w-3 h-3" /> Làm mới tư vấn
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-indigo-200 mb-6 font-medium">Nhấn vào nút bên dưới để nhận phân tích chuyên sâu về mức thuế của bạn từ Trí tuệ nhân tạo.</p>
                      <button 
                        onClick={fetchAiAdvice}
                        disabled={loadingAi}
                        className="bg-white text-indigo-900 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-100 transition-all flex items-center gap-3 disabled:opacity-50"
                      >
                        {loadingAi ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Phân tích thu nhập'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Main Result */}
            <div id="compare" className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
               <div className="flex items-center justify-between mb-10">
                 <h3 className="text-xl font-black text-slate-900">So sánh thực nhận</h3>
                 <button onClick={handleExportPDF} className="p-3 bg-slate-50 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                   <Download className="w-5 h-5" />
                 </button>
               </div>

               <div className="grid md:grid-cols-2 gap-8 mb-12">
                 <div className="relative p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                    <div className="absolute top-4 right-4 text-[10px] font-black uppercase text-slate-300">Hiện hành (2024)</div>
                    <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Lương Net</p>
                    <p className="text-4xl font-black text-slate-800">{formatVND(result2024.netSalary)}<span className="text-lg ml-1 opacity-30">₫</span></p>
                 </div>
                 <div className="relative p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100">
                    <div className="absolute top-4 right-4 text-[10px] font-black uppercase text-indigo-400">Dự kiến 2026</div>
                    <p className="text-xs font-bold text-indigo-400 mb-2 uppercase tracking-widest">Lương Net</p>
                    <p className="text-4xl font-black text-indigo-600">{formatVND(result2026.netSalary)}<span className="text-lg ml-1 opacity-30">₫</span></p>
                    {result2026.netSalary > result2024.netSalary && (
                      <div className="mt-4 inline-flex items-center gap-2 text-emerald-600 text-xs font-black uppercase">
                        <TrendingUp className="w-4 h-4" /> Tăng thêm {formatVND(result2026.netSalary - result2024.netSalary)}₫
                      </div>
                    )}
                 </div>
               </div>

               <div className="space-y-4">
                 <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600"><ShieldCheck className="w-5 h-5" /></div>
                      <div>
                        <p className="text-sm font-black text-slate-800">Thuế TNCN nộp</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Giảm gánh nặng từ 2026</p>
                      </div>
                    </div>
                    <div className="flex gap-10 items-center">
                       <div className="text-right">
                         <p className="text-[10px] font-bold text-slate-400 uppercase">2024</p>
                         <p className="text-sm font-black text-slate-400 line-through">{formatVND(result2024.personalIncomeTax)}₫</p>
                       </div>
                       <div className="text-right">
                         <p className="text-[10px] font-bold text-indigo-500 uppercase">2026</p>
                         <p className="text-xl font-black text-rose-600">{formatVND(result2026.personalIncomeTax)}₫</p>
                       </div>
                    </div>
                 </div>

                 <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-2xl shadow-sm text-emerald-600"><CreditCard className="w-5 h-5" /></div>
                      <div>
                        <p className="text-sm font-black text-slate-800">Tổng giảm trừ</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Bản thân & Phụ thuộc</p>
                      </div>
                    </div>
                    <div className="flex gap-10 items-center">
                       <div className="text-right">
                         <p className="text-[10px] font-bold text-slate-400 uppercase">2024</p>
                         <p className="text-sm font-black text-slate-500">{formatVND(result2024.selfDeduction + result2024.dependentDeduction)}₫</p>
                       </div>
                       <div className="text-right">
                         <p className="text-[10px] font-bold text-indigo-500 uppercase">2026</p>
                         <p className="text-xl font-black text-emerald-600">{formatVND(result2026.selfDeduction + result2026.dependentDeduction)}₫</p>
                       </div>
                    </div>
                 </div>
               </div>
            </div>

            {/* Details Table */}
            <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
               <h3 className="text-2xl font-black text-slate-900 mb-10">Chi tiết khấu trừ ({inputs.policyYear})</h3>
               <div className="space-y-2">
                {[
                  { label: "Lương Gross", val: currentResult.grossSalary, sub: "Tổng thu nhập doanh nghiệp chi trả", color: "text-slate-900" },
                  { label: "Bảo hiểm Xã hội (8%)", val: -currentResult.socialInsurance, sub: "Quỹ hưu trí & tử tuất", color: "text-rose-500" },
                  { label: "Bảo hiểm Y tế (1.5%)", val: -currentResult.healthInsurance, sub: "Khám chữa bệnh", color: "text-rose-500" },
                  { label: "Bảo hiểm Thất nghiệp (1%)", val: -currentResult.unemploymentInsurance, sub: "Hỗ trợ nghỉ việc", color: "text-rose-500" },
                  { label: "Thu nhập trước thuế", val: currentResult.incomeBeforeTax, sub: "Gross - Tổng bảo hiểm", color: "text-indigo-600", isMajor: true },
                  { label: "Giảm trừ gia cảnh", val: -(currentResult.selfDeduction + currentResult.dependentDeduction), sub: "Mức miễn trừ chính sách", color: "text-emerald-600" },
                  { label: "Thu nhập tính thuế", val: currentResult.taxableIncome, sub: "Số tiền tính biểu thuế lũy tiến", color: "text-indigo-600", isMajor: true },
                  { label: "Thuế TNCN nộp", val: -currentResult.personalIncomeTax, sub: "Nộp vào ngân sách nhà nước", color: "text-rose-600" },
                ].map((item, idx) => (
                  <div key={idx} className={`flex items-center justify-between p-6 rounded-3xl ${item.isMajor ? 'bg-slate-50 border border-slate-100 my-4' : ''}`}>
                    <div className="flex items-start gap-4">
                      <div className={`mt-1 p-1 rounded-lg ${item.val < 0 ? 'bg-rose-50 text-rose-500' : 'bg-slate-100 text-slate-400'}`}>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className={`text-sm font-black ${item.color}`}>{item.label}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.sub}</p>
                      </div>
                    </div>
                    <p className={`text-xl font-black ${item.color}`}>{item.val < 0 ? '-' : ''}{formatVND(Math.abs(item.val))}₫</p>
                  </div>
                ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="knowledge" className="bg-slate-900 text-white py-32">
        <div className="container mx-auto px-6 max-w-7xl">
           <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-4xl font-black mb-8">VietTax Pro</h2>
                <p className="text-slate-400 text-lg mb-10 leading-relaxed max-w-md">
                  Dữ liệu được cập nhật dựa trên luật quản lý thuế hiện hành và lộ trình cải cách dự thảo năm 2026 của Bộ Tài Chính Việt Nam.
                </p>
                <div className="flex gap-4">
                   <button onClick={() => scrollToSection('tool')} className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl text-xs font-black uppercase transition-all">Sử dụng máy tính</button>
                   <button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl text-xs font-black uppercase transition-all">Lên đầu trang</button>
                </div>
              </div>
              <div className="p-10 bg-white/5 rounded-[3rem] border border-white/10">
                <h4 className="text-xl font-black mb-6 flex items-center gap-2"><BookOpen className="w-6 h-6" /> Kiến thức thuế</h4>
                <div className="space-y-4 text-sm text-slate-400">
                  <p>• Mức giảm trừ gia cảnh hiện nay: 11 triệu đồng/tháng cho bản thân.</p>
                  <p>• Người phụ thuộc: 4,4 triệu đồng/người/tháng.</p>
                  <p>• Dự kiến 2026: Tăng mức giảm trừ lên 15 triệu (bản thân) và 6 triệu (phụ thuộc).</p>
                </div>
              </div>
           </div>
           <div className="mt-24 pt-10 border-t border-white/10 text-center">
             <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">© 2024 VietTax Pro - Ứng dụng hỗ trợ kê khai thuế.</p>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
