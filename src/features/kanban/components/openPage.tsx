import { Heading } from '@/components/ui/heading';
import { DataTable } from './table/data-table';
import { columns } from './table/column';





export default async function KanbanViewPage() {
  return (
    <div>
      <div className='space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading title={`Open Orders`} description='Manage tasks by dnd' />
        </div>
        {/* <DataTable columns={columns} data={SampleOrder}/> */}
      </div>
    </div>
  );
}
