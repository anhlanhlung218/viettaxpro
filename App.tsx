
import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  ArrowRightLeft, 
  ShieldCheck, 
  TrendingUp,
  CreditCard,
  Wallet,
  Download,
  BookOpen,
  ArrowDown,
  Zap,
  ChevronRight,
  Info,
  CalendarDays,
  ArrowRight
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Region, CalculationInputs, PolicyYear } from './types';
import { calculateGrossToNet, calculateNetToGross } from './utils/taxCalculator';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<CalculationInputs>({
    salary: 25000000,
    dependents: 0,
    region: Region.REGION_1,
    isGrossToNet: true,
    insuranceSalary: 'full',
    policyYear: PolicyYear.YEAR_2024
  });

  const [compareMode, setCompareMode] = useState(true);

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

  // Hiện tại sử dụng kết quả dựa trên mode chọn chính, hoặc kết quả so sánh
  const currentResult = inputs.policyYear === PolicyYear.YEAR_2024 ? result2024 : result2026;

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(Math.round(amount));
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("VIETTAX PRO - SO SANH CHINH SACH THUE", 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text("Cập nhật quy định 2024 & Dự kiến 2026", 105, 27, { align: 'center' });
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
    addCompareLine("Thu nhap tinh thue:", result2024.taxableIncome, result2026.taxableIncome);
    addCompareLine("Thue TNCN:", result2024.personalIncomeTax, result2026.personalIncomeTax);
    y += 10;
    doc.setFontSize(14);
    addCompareLine("LUONG NET:", result2024.netSalary, result2026.netSalary);
    
    doc.save(`So_Sanh_Thue_VietTaxPro.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 z-[100]">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-200">
              <Calculator className="w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">VietTax Pro</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#tool" className="text-xs font-black text-slate-400 hover:text-indigo-600 transition-all uppercase tracking-[0.2em]">Máy tính</a>
            <a href="#compare" className="text-xs font-black text-slate-400 hover:text-indigo-600 transition-all uppercase tracking-[0.2em]">So sánh 2026</a>
            <a href="#knowledge" className="text-xs font-black text-slate-400 hover:text-indigo-600 transition-all uppercase tracking-[0.2em]">Kiến thức</a>
          </div>

          <button 
            onClick={() => document.getElementById('tool')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-slate-900 text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
          >
            Tính toán
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-20 container mx-auto px-6 max-w-5xl text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-10 border border-emerald-100">
          <CalendarDays className="w-3.5 h-3.5" /> Lộ trình cải cách thuế 01/01/2026
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.95] mb-10 tracking-tighter">
          Đón đầu thay đổi.<br />
          <span className="text-indigo-600">Làm chủ thu nhập.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
          So sánh sự khác biệt giữa quy định thuế hiện hành và dự thảo đổi mới năm 2026. 
          Giảm bớt áp lực thuế, tăng thêm lương thực nhận.
        </p>
      </section>

      {/* Main Tool */}
      <section id="tool" className="py-20 container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Input Panel */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] border border-slate-100 p-10 sticky top-32">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Cấu hình</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setInputs(p => ({ ...p, isGrossToNet: !p.isGrossToNet }))}
                    className="flex items-center gap-2 bg-slate-50 text-slate-900 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" /> {inputs.isGrossToNet ? 'Gross → Net' : 'Net → Gross'}
                  </button>
                </div>
              </div>

              <div className="space-y-10">
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-900 uppercase tracking-widest flex justify-between">
                    Mức lương hàng tháng
                    <span className="text-indigo-600">VND</span>
                  </label>
                  <div className="relative group">
                    <input 
                      type="number" 
                      value={inputs.salary}
                      onChange={(e) => setInputs(p => ({ ...p, salary: Number(e.target.value) }))}
                      className="w-full px-10 py-8 bg-slate-50 border-2 border-slate-100 rounded-[2rem] focus:border-indigo-500 focus:bg-white outline-none transition-all text-4xl font-black text-slate-900"
                    />
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 font-black text-2xl group-focus-within:text-indigo-500 transition-colors">₫</div>
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
                     <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Chính sách áp dụng</span>
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

          {/* Result Panel */}
          <div className="lg:col-span-7 space-y-8">
            {/* Compare Dashboard */}
            <div id="compare" className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
               <div className="flex items-center justify-between mb-10">
                 <h3 className="text-xl font-black text-slate-900">So sánh thực nhận</h3>
                 <button onClick={handleExportPDF} className="p-3 bg-slate-50 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                   <Download className="w-5 h-5" />
                 </button>
               </div>

               <div className="grid md:grid-cols-2 gap-8 mb-12">
                 <div className="relative p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 overflow-hidden group">
                    <div className="absolute top-4 right-4 text-[10px] font-black uppercase text-slate-300">2024-2025</div>
                    <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Lương thực nhận (Net)</p>
                    <p className="text-4xl font-black text-slate-800">{formatVND(result2024.netSalary)}<span className="text-lg ml-1 opacity-30">₫</span></p>
                 </div>
                 <div className="relative p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 overflow-hidden group">
                    <div className="absolute top-4 right-4 text-[10px] font-black uppercase text-indigo-400">Dự kiến 2026</div>
                    <p className="text-xs font-bold text-indigo-400 mb-2 uppercase tracking-widest">Lương thực nhận (Net)</p>
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
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Giảm đáng kể từ 2026</p>
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
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Bản thân & Phụ thuộc</p>
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

            {/* Detailed Table for Selected Policy */}
            <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
               <div className="flex items-center justify-between mb-12">
                 <div>
                   <h3 className="text-2xl font-black text-slate-900">Chi tiết khấu trừ ({inputs.policyYear})</h3>
                   <p className="text-slate-400 text-sm font-medium mt-1">Dữ liệu phân tích chuyên sâu cho bạn</p>
                 </div>
               </div>
               
               <div className="space-y-2">
                {[
                  { label: "Lương Gross", val: currentResult.grossSalary, sub: "Tổng thu nhập doanh nghiệp chi trả", color: "text-slate-900" },
                  { label: "Bảo hiểm Xã hội (8%)", val: -currentResult.socialInsurance, sub: "Đóng vào quỹ hưu trí & tử tuất", color: "text-rose-500" },
                  { label: "Bảo hiểm Y tế (1.5%)", val: -currentResult.healthInsurance, sub: "Dành cho dịch vụ khám chữa bệnh", color: "text-rose-500" },
                  { label: "Bảo hiểm Thất nghiệp (1%)", val: -currentResult.unemploymentInsurance, sub: "Hỗ trợ khi nghỉ việc", color: "text-rose-500" },
                  { label: "Thu nhập trước thuế", val: currentResult.incomeBeforeTax, sub: "Gross - Tổng bảo hiểm", color: "text-indigo-600", isMajor: true },
                  { label: "Giảm trừ gia cảnh", val: -(currentResult.selfDeduction + currentResult.dependentDeduction), sub: "Mức miễn trừ theo chính sách", color: "text-emerald-600" },
                  { label: "Thu nhập tính thuế", val: currentResult.taxableIncome, sub: "Số tiền dùng để tính các bậc thuế", color: "text-indigo-600", isMajor: true },
                  { label: "Thuế TNCN", val: -currentResult.personalIncomeTax, sub: "Dựa trên biểu thuế lũy tiến", color: "text-rose-600" },
                ].map((item, idx) => (
                  <div key={idx} className={`flex items-center justify-between p-6 rounded-3xl transition-all hover:bg-slate-50/50 ${item.isMajor ? 'bg-slate-50 border border-slate-100 my-4' : ''}`}>
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

      {/* Information Section */}
      <section id="knowledge" className="py-32 bg-slate-900 text-white">
        <div className="container mx-auto px-6 max-w-7xl">
           <div className="text-center mb-24 max-w-3xl mx-auto">
             <h2 className="text-4xl md:text-5xl font-black mb-10">Lộ trình thay đổi 2026</h2>
             <p className="text-slate-400 font-medium text-lg leading-relaxed">
               Quốc hội đang thảo luận việc điều chỉnh mức giảm trừ gia cảnh để phù hợp với sự biến động của giá cả và thu nhập thực tế. 
               Việc tăng mức giảm trừ giúp kích cầu tiêu dùng và giảm gánh nặng tài chính cho người làm công ăn lương.
             </p>
           </div>

           <div className="grid md:grid-cols-2 gap-10">
              <div className="p-12 bg-white/5 rounded-[3.5rem] border border-white/10 relative group">
                <div className="absolute top-0 right-0 p-8 text-indigo-400 opacity-20"><Info className="w-16 h-16" /></div>
                <h4 className="text-2xl font-black mb-8">Thay đổi Giảm trừ</h4>
                <div className="space-y-6">
                   <div className="flex justify-between items-center py-4 border-b border-white/5">
                      <span className="text-slate-400">Giảm trừ bản thân:</span>
                      <div className="flex items-center gap-3">
                         <span className="text-slate-500 line-through">11M</span>
                         <ArrowRight className="w-4 h-4 text-indigo-400" />
                         <span className="text-xl font-black text-white">15.000.000₫</span>
                      </div>
                   </div>
                   <div className="flex justify-between items-center py-4">
                      <span className="text-slate-400">Người phụ thuộc:</span>
                      <div className="flex items-center gap-3">
                         <span className="text-slate-500 line-through">4.4M</span>
                         <ArrowRight className="w-4 h-4 text-indigo-400" />
                         <span className="text-xl font-black text-white">6.000.000₫</span>
                      </div>
                   </div>
                </div>
              </div>

              <div className="p-12 bg-indigo-600 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <h4 className="text-2xl font-black mb-8 flex items-center gap-3"><BookOpen className="w-7 h-7" /> Ý nghĩa cải cách</h4>
                <p className="text-indigo-100 font-medium leading-relaxed">
                  Chính sách mới tập trung vào việc nới rộng các khoảng thu nhập được miễn thuế. 
                  Điều này giúp người lao động có thu nhập trung bình thấp có thể không còn thuộc diện nộp thuế, 
                  trong khi người thu nhập cao cũng được giảm một phần đáng kể nghĩa vụ thuế hàng tháng.
                </p>
                <div className="mt-10 p-6 bg-white/10 rounded-2xl flex items-center gap-4">
                   <TrendingUp className="w-6 h-6 text-white" />
                   <span className="text-sm font-black uppercase tracking-widest">Gia tăng thực nhận từ 5% - 15%</span>
                </div>
              </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-20">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 p-2.5 rounded-2xl text-white"><Calculator className="w-6 h-6" /></div>
            <span className="text-2xl font-black tracking-tight">VietTax Pro</span>
          </div>
          <p className="text-slate-400 text-[10px] font-black tracking-[0.3em] uppercase">© 2024 Cập nhật chính sách thuế Việt Nam mới nhất.</p>
          <div className="flex items-center gap-8 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
            Lên đầu trang
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
