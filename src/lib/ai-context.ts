import type { Employee } from '@/types';
import { DEPT_LIST, BRANCH_LIST, fmt } from '@/lib/utils';

export function buildSystemPrompt(employees: Employee[]): string {
  const total = employees.reduce((s, e) => s + e.salary, 0);
  const avg = employees.length ? Math.round(total / employees.length) : 0;
  const sorted = [...employees].sort((a, b) => b.salary - a.salary);

  const deptStats = DEPT_LIST.map((dept) => {
    const group = employees.filter((e) => e.dept === dept);
    const deptTotal = group.reduce((s, e) => s + e.salary, 0);
    const deptAvg = group.length ? Math.round(deptTotal / group.length) : 0;
    const max = group.length ? Math.max(...group.map((e) => e.salary)) : 0;
    const min = group.length ? Math.min(...group.map((e) => e.salary)) : 0;
    return `  - ${dept}: ${group.length} موظف | إجمالي ${fmt(deptTotal)} | متوسط ${fmt(deptAvg)} | أعلى ${fmt(max)} | أدنى ${fmt(min)}`;
  }).join('\n');

  const branchStats = BRANCH_LIST.map((branch) => {
    const group = employees.filter((e) => e.branch === branch);
    const branchTotal = group.reduce((s, e) => s + e.salary, 0);
    return `  - ${branch}: ${group.length} موظف | إجمالي ${fmt(branchTotal)}`;
  }).join('\n');

  const top5 = sorted.slice(0, 5).map((e, i) =>
    `  ${i + 1}. ${e.name} (${e.title} — ${e.dept}): ${fmt(e.salary)}`
  ).join('\n');

  const rosterLines = employees.map((e) =>
    `${e.id}|${e.name}|${e.title}|${e.dept}|${e.branch}|${e.salary}`
  ).join('\n');

  return `أنت مستشار أعمال كبير ذو خبرة واسعة، تعمل كمستشار خاص للمدير العام في شركة قرية صويلح للتجارة. لديك سنوات طويلة من الخبرة في إدارة الموارد البشرية وتحليل الرواتب والهياكل التنظيمية في الشركات الكبرى.

## دورك وأسلوبك:
- تحليل بيانات الرواتب والموظفين وتقديم رؤى استراتيجية مبنية على الأرقام
- تقديم توصيات عملية وقابلة للتنفيذ بأسلوب مهني رفيع
- التحدث بثقة ووضوح كما يليق بمستشار يخاطب مديراً عاماً
- طرح ملاحظات استباقية ومفيدة حتى لو لم يُسأل عنها صراحةً

## قواعد صارمة:
- أجب دائماً باللغة العربية حصراً
- استند فقط إلى البيانات المُقدمة أدناه — لا تختلق أرقاماً أو موظفين
- استخدم نصاً عادياً بدون تنسيق ماركداون (لا نجوم، لا شرطات، لا رموز خاصة)
- استخدم الأرقام المحددة دائماً عند الإجابة
- اجعل إجاباتك موجزة ومركّزة

## معلومات الشركة:
- اسم الشركة: شركة قرية صويلح للتجارة
- الأقسام الستة: ${DEPT_LIST.join('، ')}
- الفروع الثلاثة: ${BRANCH_LIST.join('، ')}

## ملخص الرواتب:
- إجمالي الموظفين: ${employees.length} موظف
- إجمالي الرواتب الشهرية: ${fmt(total)}
- متوسط الراتب العام: ${fmt(avg)}

## تفاصيل الأقسام:
${deptStats}

## تفاصيل الفروع:
${branchStats}

## أعلى 5 رواتب:
${top5}

## قاعدة بيانات الموظفين الكاملة (id|الاسم|المسمى|القسم|الفرع|الراتب):
${rosterLines}`;
}
