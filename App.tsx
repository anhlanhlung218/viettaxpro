
import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  ArrowRightLeft, 
  ShieldCheck, 
  TrendingUp,
  Download,
  BookOpen,
  Zap,
  ChevronRight,
  Info,
  CalendarDays,
  ArrowRight,
  Sparkles,
  Loader2,
  RefreshCcw,
  CheckCircle2,
  Layers,
  ArrowDown,
  CreditCard
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
      setAiAdvice("Kết nối AI gián đoạn. Vui lòng thử lại sau.");
    } finally {
      setLoadingAi(false);
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59);
    doc.text("VIETTAX PRO - REPORT", 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text("Dữ liệu cập nhật lộ trình 2024-2026", 105, 27, { align: 'center' });
    doc.line(20, 35, 190, 35);
    
    let y = 55;
    const addLine = (label: string, v2024: number, v2026: number) => {
      doc.text(label, 20, y);
      doc.text(formatVND(v2024), 130, y, { align: 'right' });
      doc.text(formatVND(v2026), 180, y, { align: 'right' });
      y += 10;
    };

    doc.text("Hạng mục", 20, 48);
    doc.text("Chính sách 2024", 130, 48, { align: 'right' });
    doc.text("Chính sách 2026", 180, 48, { align: 'right' });
    doc.line(20, 50, 190, 50);

    addLine("Lương Gross:", result2024.grossSalary, result2026.grossSalary);
    addLine("Giảm trừ gia cảnh:", result2024.selfDeduction + result2024.dependentDeduction, result2026.selfDeduction + result2026.dependentDeduction);
    addLine("Thuế TNCN:", result2024.personalIncomeTax, result2026.personalIncomeTax);
    y += 10;
    doc.setFontSize(14);
    addLine("LƯƠNG THỰC NHẬN (NET):", result2024.netSalary, result2026.netSalary);
    
    doc.save(`VietTax_Report_v25.pdf`);
  };

  return (
    <div className="min-h-screen">
      {/* Version Badge */}
      <div className="fixed bottom-6 right-6 z-[200]">
        <div className="bg-slate-900 text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-2xl flex items-center gap-2 border border-white/10">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          VietTax v2.5 Online
        </div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-slate-100 z-[100]">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-xl">
              <Calculator className="w-6 h-6" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">VietTax<span className="text-indigo-600">Pro</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            <button onClick={() => scrollToSection('tool')} className="text-xs font-bold text-slate-500 hover:text-indigo-600 uppercase tracking-widest transition-colors">Máy tính</button>
            <button onClick={() => scrollToSection('compare')} className="text-xs font-bold text-slate-500 hover:text-indigo-600 uppercase tracking-widest transition-colors">So sánh</button>
            <button onClick={() => scrollToSection('knowledge')} className="text-xs font-bold text-slate-500 hover:text-indigo-600 uppercase tracking-widest transition-colors">Kiến thức</button>
          </div>

          <button 
            onClick={() => scrollToSection('tool')}
            className="bg-indigo-600 text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            Tính toán ngay
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-32 container mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-12 border border-indigo-100/50">
          <Sparkles className="w-3.5 h-3.5" /> Công cụ phân tích thuế 2024 - 2026
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[1.05] mb-12 tracking-tight">
          Lương Net cao hơn,<br />
          <span className="gradient-text">Thuế TNCN thấp hơn.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 font-medium mb-16 max-w-2xl mx-auto leading-relaxed">
          Tự động áp dụng mức giảm trừ gia cảnh mới dự kiến năm 2026 (15 triệu/tháng) giúp bạn hoạch định tài chính chính xác nhất.
        </p>
        <button 
          onClick={() => scrollToSection('tool')}
          className="bg-slate-900 text-white p-6 rounded-full hover:scale-105 transition-transform shadow-2xl"
        >
          {/* @fix: added missing ArrowDown icon to lucide-react imports */}
          <ArrowDown className="w-6 h-6 animate-bounce" />
        </button>
      </section>

      {/* Main App */}
      <section id="tool" className="py-24 bg-slate-50/50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-16">
            
            {/* Control Panel */}
            <div className="lg:col-span-5">
              <div className="premium-card rounded-[3rem] p-10 sticky top-32">
                <div className="flex items-center justify-between mb-12">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Cấu hình</h3>
                  <button 
                    onClick={() => setInputs(p => ({ ...p, isGrossToNet: !p.isGrossToNet }))}
                    className="flex items-center gap-2 bg-slate-50 text-slate-900 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" /> {inputs.isGrossToNet ? 'Gross → Net' : 'Net → Gross'}
                  </button>
                </div>

                <div className="space-y-12">
                  <div className="space-y-5">
                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex justify-between">
                      Mức lương tháng mong muốn
                      <span className="text-indigo-600">VNĐ</span>
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        inputMode="numeric"
                        value={inputs.salary === 0 ? '' : formatVND(inputs.salary)}
                        onChange={handleSalaryInputChange}
                        placeholder="0"
                        className="w-full px-10 py-10 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] focus:border-indigo-500 focus:bg-white outline-none transition-all text-5xl font-black text-slate-900 placeholder:text-slate-200"
                      />
                      <div className="absolute right-10 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-3xl">₫</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Người phụ thuộc</label>
                      <select 
                        value={inputs.dependents}
                        onChange={(e) => setInputs(p => ({ ...p, dependents: Number(e.target.value) }))}
                        className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:border-indigo-500 outline-none font-bold text-slate-700 cursor-pointer"
                      >
                        {[0,1,2,3,4,5].map(v => <option key={v} value={v}>{v} người</option>)}
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Khu vực làm việc</label>
                      <select 
                        value={inputs.region}
                        onChange={(e) => setInputs(p => ({ ...p, region: e.target.value as Region }))}
                        className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:border-indigo-500 outline-none font-bold text-slate-700 cursor-pointer"
                      >
                        {Object.values(Region).map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white">
                    <div className="flex items-center gap-3 mb-8">
                       <Layers className="w-5 h-5 text-indigo-400" />
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Chọn lộ trình thuế</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => setInputs(p => ({ ...p, policyYear: PolicyYear.YEAR_2024 }))}
                        className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${inputs.policyYear === PolicyYear.YEAR_2024 ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                      >
                        Luật hiện hành
                      </button>
                      <button 
                        onClick={() => setInputs(p => ({ ...p, policyYear: PolicyYear.YEAR_2026 }))}
                        className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${inputs.policyYear === PolicyYear.YEAR_2026 ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                      >
                        Lộ trình 2026
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-7 space-y-12">
              
              {/* AI Expert */}
              <div className="bg-white rounded-[3rem] p-12 border border-indigo-100 shadow-2xl shadow-indigo-100/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="relative flex flex-col md:flex-row gap-10 items-start">
                  <div className="bg-indigo-600 p-5 rounded-[2rem] shadow-xl shadow-indigo-200">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-black mb-4">Tư vấn thuế từ chuyên gia AI</h4>
                    {aiAdvice ? (
                      <div className="prose prose-sm prose-slate max-w-none">
                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-slate-600 leading-relaxed font-medium">
                          {aiAdvice.split('\n').map((line, i) => <p key={i} className="mb-2">{line}</p>)}
                        </div>
                        <button 
                          onClick={() => setAiAdvice(null)}
                          className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                          <RefreshCcw className="w-3.5 h-3.5" /> Nhận tư vấn mới
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <p className="text-slate-500 font-medium leading-relaxed">VietTax AI sẽ phân tích thu nhập của bạn để đưa ra các giải pháp tối ưu hóa thuế TNCN hợp pháp.</p>
                        <button 
                          onClick={fetchAiAdvice}
                          disabled={loadingAi}
                          className="bg-slate-900 text-white px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-4 disabled:opacity-50"
                        >
                          {loadingAi ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Bắt đầu phân tích'}
                          {!loadingAi && <ChevronRight className="w-4 h-4" />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Compare Dashboard */}
              <div id="compare" className="premium-card rounded-[3.5rem] p-12">
                <div className="flex items-center justify-between mb-12">
                  <h3 className="text-2xl font-black text-slate-900">So sánh thực nhận</h3>
                  <button onClick={handleExportPDF} className="flex items-center gap-2 bg-slate-50 hover:bg-indigo-50 px-6 py-3 rounded-2xl transition-all">
                    <Download className="w-5 h-5 text-indigo-600" />
                    <span className="text-[10px] font-black uppercase text-slate-600">Tải báo cáo</span>
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-10 mb-12">
                  <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 mb-4">
                      <CalendarDays className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Năm 2024 (Hiện hành)</span>
                    </div>
                    <p className="text-5xl font-black text-slate-900 mb-2">{formatVND(result2024.netSalary)}<span className="text-lg opacity-30 ml-1">₫</span></p>
                    <p className="text-xs font-bold text-slate-400 uppercase">Lương Net thực nhận</p>
                  </div>
                  <div className="p-10 bg-indigo-600 rounded-[3rem] text-white shadow-2xl shadow-indigo-200">
                    <div className="flex items-center gap-2 text-indigo-200 mb-4">
                      <Zap className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Năm 2026 (Dự thảo mới)</span>
                    </div>
                    <p className="text-5xl font-black mb-2">{formatVND(result2026.netSalary)}<span className="text-lg opacity-40 ml-1">₫</span></p>
                    <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase">
                      <TrendingUp className="w-4 h-4" /> 
                      {result2026.netSalary > result2024.netSalary ? `Tăng thêm ${formatVND(result2026.netSalary - result2024.netSalary)}₫` : 'Giữ nguyên'}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-8 bg-slate-50/50 rounded-3xl border border-slate-100 group transition-all hover:bg-white">
                    <div className="flex items-center gap-5">
                      <div className="p-4 bg-white rounded-[1.25rem] shadow-sm text-rose-500"><ShieldCheck className="w-6 h-6" /></div>
                      <div>
                        <p className="text-sm font-black text-slate-800">Tiền thuế TNCN nộp</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Nghĩa vụ hàng tháng</p>
                      </div>
                    </div>
                    <div className="flex gap-12 text-right">
                       <div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">2024</p>
                         <p className="text-sm font-black text-slate-400 line-through">{formatVND(result2024.personalIncomeTax)}₫</p>
                       </div>
                       <div>
                         <p className="text-[10px] font-bold text-indigo-500 uppercase mb-1">2026</p>
                         <p className="text-2xl font-black text-rose-600">{formatVND(result2026.personalIncomeTax)}₫</p>
                       </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-8 bg-slate-50/50 rounded-3xl border border-slate-100 group transition-all hover:bg-white">
                    <div className="flex items-center gap-5">
                      {/* @fix: added missing CreditCard icon to lucide-react imports */}
                      <div className="p-4 bg-white rounded-[1.25rem] shadow-sm text-emerald-600"><CreditCard className="w-6 h-6" /></div>
                      <div>
                        <p className="text-sm font-black text-slate-800">Mức giảm trừ gia cảnh</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Bản thân & Phụ thuộc</p>
                      </div>
                    </div>
                    <div className="flex gap-12 text-right">
                       <div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">2024</p>
                         <p className="text-sm font-black text-slate-500">{formatVND(result2024.selfDeduction + result2024.dependentDeduction)}₫</p>
                       </div>
                       <div>
                         <p className="text-[10px] font-bold text-indigo-500 uppercase mb-1">2026</p>
                         <p className="text-2xl font-black text-emerald-600">{formatVND(result2026.selfDeduction + result2026.dependentDeduction)}₫</p>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="premium-card rounded-[3.5rem] p-12 overflow-hidden">
                <div className="flex items-center justify-between mb-12">
                   <h3 className="text-2xl font-black text-slate-900">Diễn giải cách tính ({inputs.policyYear})</h3>
                   <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2">
                     <CheckCircle2 className="w-4 h-4" /> Đã cập nhật
                   </div>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "Lương Gross", val: currentResult.grossSalary, sub: "Tổng thu nhập", color: "text-slate-900", isMajor: true },
                    { label: "Bảo hiểm Xã hội (8%)", val: -currentResult.socialInsurance, sub: "Đóng quỹ hưu trí", color: "text-rose-500" },
                    { label: "Bảo hiểm Y tế (1.5%)", val: -currentResult.healthInsurance, sub: "Dịch vụ y tế", color: "text-rose-500" },
                    { label: "Bảo hiểm Thất nghiệp (1%)", val: -currentResult.unemploymentInsurance, sub: "Dự phòng nghỉ việc", color: "text-rose-500" },
                    { label: "Thu nhập trước thuế", val: currentResult.incomeBeforeTax, sub: "Gross - Bảo hiểm", color: "text-indigo-600", isMajor: true },
                    { label: "Giảm trừ gia cảnh", val: -(currentResult.selfDeduction + currentResult.dependentDeduction), sub: "Định mức miễn trừ", color: "text-emerald-600" },
                    { label: "Thu nhập tính thuế", val: currentResult.taxableIncome, sub: "Phần phải chịu thuế", color: "text-indigo-600", isMajor: true },
                    { label: "Thuế TNCN nộp", val: -currentResult.personalIncomeTax, sub: "Luật thuế hiện hành", color: "text-rose-600" },
                  ].map((item, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-6 rounded-3xl transition-all ${item.isMajor ? 'bg-slate-50 border border-slate-100 my-4' : 'hover:bg-slate-50/50'}`}>
                      <div className="flex items-start gap-4">
                        <div className={`mt-1 p-1 rounded-lg ${item.val < 0 ? 'bg-rose-50 text-rose-500' : 'bg-indigo-50 text-indigo-400'}`}>
                          <ChevronRight className="w-4 h-4" />
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
        </div>
      </section>

      {/* Footer / Knowledge */}
      <footer id="knowledge" className="bg-slate-900 text-white py-40">
        <div className="container mx-auto px-6 max-w-7xl">
           <div className="grid md:grid-cols-2 gap-20 items-center">
              <div>
                <div className="flex items-center gap-3 mb-10">
                   <div className="bg-indigo-600 p-3 rounded-2xl"><Calculator className="w-8 h-8" /></div>
                   <span className="text-3xl font-black">VietTax Pro</span>
                </div>
                <p className="text-slate-400 text-lg mb-12 leading-relaxed max-w-lg">
                  Nền tảng hỗ trợ người lao động Việt Nam hiểu rõ về thu nhập và chính sách thuế. 
                  Luôn cập nhật những thay đổi mới nhất từ Bộ Tài Chính.
                </p>
                <div className="flex gap-4">
                   <button onClick={() => scrollToSection('tool')} className="bg-white text-slate-900 px-8 py-4 rounded-2xl text-xs font-black uppercase hover:bg-indigo-100 transition-colors">Dùng thử ngay</button>
                   <button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="bg-white/10 px-8 py-4 rounded-2xl text-xs font-black uppercase hover:bg-white/20 transition-colors">Lên đầu trang</button>
                </div>
              </div>
              <div className="p-12 bg-white/5 rounded-[4rem] border border-white/10 backdrop-blur-3xl relative">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
                <h4 className="text-2xl font-black mb-10 flex items-center gap-3"><BookOpen className="w-8 h-8 text-indigo-400" /> Tóm tắt 2026</h4>
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center shrink-0 text-indigo-400"><Info className="w-6 h-6" /></div>
                    <p className="text-slate-400 text-sm leading-relaxed">Mức giảm trừ gia cảnh dự kiến tăng từ **11 triệu lên 15 triệu đồng/tháng** đối với bản thân người lao động.</p>
                  </div>
                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center shrink-0 text-indigo-400"><TrendingUp className="w-6 h-6" /></div>
                    <p className="text-slate-400 text-sm leading-relaxed">Mức giảm trừ đối với người phụ thuộc dự kiến tăng lên **6 triệu đồng/người/tháng**.</p>
                  </div>
                </div>
              </div>
           </div>
           <div className="mt-32 pt-12 border-t border-white/5 text-center">
             <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]">© 2024 VietTax Pro Premium v2.5. Hỗ trợ sự nghiệp của bạn.</p>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
